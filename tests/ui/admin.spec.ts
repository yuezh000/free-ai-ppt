import { expect, test } from "@playwright/test";

const session = { token:"admin-token", expires_at:"2099-01-01T00:00:00Z", password_set:true, is_admin:true, user:{id:"admin",email:"admin@example.com"} };

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/account/allowance",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({total:10,used:0,remaining:10})}));
});

test("administrator sees mocked tasks and trial candidates",async({page})=>{
  await page.addInitScript(value=>localStorage.setItem("freeppt-auth",JSON.stringify(value)),session);
  await page.route("**/api/v1/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:session.user,password_set:true,is_admin:true})}));
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/admin/jobs",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({jobs:[{id:"job-1",prompt:"Investor update",status:"pending",ready_at:"2099-01-01T00:00:00Z",agent_id:null,lease_until:null,attempts:0,max_attempts:3,error:null,created_at:"2099-01-01T00:00:00Z",updated_at:"2099-01-01T00:00:00Z",completed_at:null,user_email:"member@example.com",input_count:2,template_slug:"startup-pitch-deck"}]})}));
  await page.route("**/api/v1/admin/waitlist",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({entries:[{id:"lead-1",email:"candidate@example.com",source:"generator",locale:"zh-CN",created_at:"2099-01-01T00:00:00Z",updated_at:"2099-01-01T00:00:00Z"}]})}));
  await page.route("**/api/v1/admin/users?*",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({users:[{id:"member",email:"member@example.com",created_at:"2099-01-01T00:00:00Z",granted:0,used:6}],total:1,page:1,page_size:50})}));
  await page.goto("/admin");
  await expect(page.getByRole("heading",{name:"FreeAIPPT admin"})).toBeVisible();
  await expect(page.getByText("Investor update",{exact:true})).toBeVisible();
  await expect(page.getByText("candidate@example.com",{exact:true})).toBeVisible();
  await expect(page.getByText("startup-pitch-deck",{exact:true})).toBeVisible();
  await expect(page.getByText("Task submission · ON",{exact:true})).toBeVisible();
  await expect(page.getByTestId("admin-user-member")).toContainText("member@example.com");
  await expect(page.getByTestId("admin-resource-primary")).toContainText("150");
  await expect(page.getByText("Indexable resource urls",{exact:true})).toBeVisible();
  await expect(page.getByTestId("admin-resource-indexed")).toContainText("1193");
  await expect(page.getByTestId("admin-resource-templates")).toContainText("133");
  await expect(page.getByTestId("admin-resource-categories")).toContainText("12");
  await expect(page.getByTestId("admin-resource-guides")).toContainText("2");
  await expect(page.getByTestId("admin-resource-row-template-details")).toContainText("1064");
  await expect(page.getByTestId("admin-resource-stats")).toContainText("Sitemap total: 1209 URLs");
});

test("non-admin account is denied by the mocked admin API",async({page})=>{
  await page.addInitScript(value=>localStorage.setItem("freeppt-auth",JSON.stringify(value)),session);
  await page.route("**/api/v1/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:session.user,password_set:true,is_admin:false})}));
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/admin/jobs",route=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:"forbidden"})}));
  await page.route("**/api/v1/admin/waitlist",route=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:"forbidden"})}));
  await page.route("**/api/v1/admin/users?*",route=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:"forbidden"})}));
  await page.goto("/admin");
  await expect(page.getByRole("heading",{name:"Access denied"})).toBeVisible();
  await expect(page.getByTestId("admin-resource-stats")).toHaveCount(0);
});

test("administrator searches accounts and grants pages through the mocked API",async({page})=>{
  await page.addInitScript(value=>localStorage.setItem("freeppt-auth",JSON.stringify(value)),session);
  await page.route("**/api/v1/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:session.user,password_set:true,is_admin:true})}));
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/admin/jobs",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({jobs:[]})}));
  await page.route("**/api/v1/admin/waitlist",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({entries:[]})}));
  let granted=0;
  await page.route("**/api/v1/admin/users?*",route=>{
    const query=new URL(route.request().url()).searchParams.get("q");
    const users=query==="member"?[{id:"member",email:"member@example.com",created_at:"2099-01-01T00:00:00Z",granted,used:6}]:[];
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({users,total:users.length,page:1,page_size:50})});
  });
  await page.route("**/api/v1/admin/users/member/page-grants",async route=>{
    expect(route.request().headers().authorization).toBe("Bearer admin-token");
    expect(await route.request().postDataJSON()).toEqual({pages:7,note:"Support credit"});
    granted=7;
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({message:"pages granted"})});
  });
  await page.goto("/admin");
  await page.getByTestId("admin-user-search").fill("member");
  await page.getByTestId("admin-user-search-submit").click();
  await expect(page.getByTestId("admin-user-member")).toContainText("member@example.com");
  await page.getByTestId("admin-user-member-grant").click();
  await page.getByTestId("admin-grant-pages").fill("7");
  await page.getByTestId("admin-grant-note").fill("Support credit");
  await page.getByTestId("admin-grant-submit").click();
  await expect(page.getByTestId("admin-grant-message")).toContainText("Added 7 pages");
  await expect(page.getByTestId("admin-user-member")).toContainText("7");
});
