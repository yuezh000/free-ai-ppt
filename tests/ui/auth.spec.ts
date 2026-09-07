import { expect, test, type Page } from "@playwright/test";

const future = "2099-01-01T00:00:00Z";
const authSession = (email: string, passwordSet = false, isAdmin = false) => ({ token:"mock-session-token", expires_at:future, password_set:passwordSet, is_admin:isAdmin, user:{id:"mock-user",email} });

async function mockAccount(page: Page, email: string, passwordSet = false, isAdmin = false) {
  await page.route("**/api/v1/auth/me", route => route.fulfill({ status:200, contentType:"application/json", body:JSON.stringify({user:{id:"mock-user",email},password_set:passwordSet,is_admin:isAdmin}) }));
}

async function openAuth(page: Page) {
  await page.goto("/");
  await page.getByTestId("auth-trigger").click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("sign-in button opens the authentication dialog", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByRole("heading", { name:"Welcome to FreeAIPPT" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("new user can complete mocked email sign-up", async ({ page }) => {
  let requestedEmail = "";
  await page.route("**/api/v1/auth/signup/request-code", async route => {
    requestedEmail = (await route.request().postDataJSON()).email;
    await route.fulfill({ status:200, contentType:"application/json", body:JSON.stringify({message:"verification code sent"}) });
  });
  await page.route("**/api/v1/auth/signup/verify-code", async route => {
    const body = await route.request().postDataJSON();
    expect(body).toEqual({email:"new@example.com",code:"123456"});
    await route.fulfill({ status:200, contentType:"application/json", body:JSON.stringify(authSession(body.email)) });
  });
  await openAuth(page);
  await page.getByTestId("auth-signup-mode-toggle").click();
  await expect(page.getByRole("heading", { name:"Create your FreeAIPPT account" })).toBeVisible();
  await page.getByLabel("Email").fill("new@example.com");
  await page.getByTestId("auth-email-submit").click();
  expect(requestedEmail).toBe("new@example.com");
  await page.getByLabel("6-digit code").fill("123456");
  await page.getByTestId("auth-code-submit").click();
  await expect(page.getByText("new@example.com", { exact:true })).toBeVisible();
  await page.getByTestId("auth-success-close").click();
  await page.getByTestId("account-menu-trigger").click();
  await expect(page.getByTestId("account-menu-password")).toHaveText("Set password");
});

test("existing user can sign in with a mocked password API", async ({ page }) => {
  await page.route("**/api/v1/auth/password-login", async route => {
    expect(await route.request().postDataJSON()).toEqual({email:"member@example.com",password:"correct-password"});
    await route.fulfill({ status:200, contentType:"application/json", body:JSON.stringify(authSession("member@example.com",true)) });
  });
  await openAuth(page);
  await page.getByTestId("auth-password-mode-toggle").click();
  await page.getByLabel("Email").fill("member@example.com");
  await page.getByLabel("Password").fill("correct-password");
  await page.getByTestId("auth-email-submit").click();
  await expect(page.getByText("member@example.com", { exact:true })).toBeVisible();
  await page.getByTestId("auth-success-close").click();
  await page.getByTestId("account-menu-trigger").click();
  await expect(page.getByTestId("account-menu-password")).toHaveText("Change password");
});

test("signed-in user can set a password with a mocked API", async ({ page }) => {
  await page.addInitScript(session => localStorage.setItem("freeppt-auth", JSON.stringify(session)), authSession("new@example.com"));
  await mockAccount(page,"new@example.com");
  let authorization = "";
  await page.route("**/api/v1/auth/password", async route => {
    authorization = route.request().headers().authorization;
    expect(await route.request().postDataJSON()).toEqual({current_password:null,new_password:"new-password-123"});
    await route.fulfill({ status:200, contentType:"application/json", body:JSON.stringify({message:"password updated"}) });
  });
  await page.goto("/");
  await page.getByTestId("account-menu-trigger").click();
  await page.getByTestId("account-menu-password").click();
  await page.getByLabel("New password").fill("new-password-123");
  await page.getByTestId("auth-password-save").click();
  expect(authorization).toBe("Bearer mock-session-token");
  await expect(page.getByRole("heading", { name:"Password updated." })).toBeVisible();
});

test("personal menu exposes admin panel only for an administrator", async ({ page }) => {
  await page.addInitScript(session => localStorage.setItem("freeppt-auth", JSON.stringify(session)), authSession("admin@example.com",true,true));
  await mockAccount(page,"admin@example.com",true,true);
  await page.goto("/");
  await page.getByTestId("account-menu-trigger").click();
  await expect(page.getByTestId("account-menu-admin")).toHaveAttribute("href","/admin");
  await expect(page.getByTestId("account-menu-password")).toHaveText("Change password");
  await expect(page.getByTestId("account-menu-sign-out")).toBeVisible();
});
