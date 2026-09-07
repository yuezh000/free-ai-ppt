import { expect, test } from "@playwright/test";

const session = { token:"mock-session-token", expires_at:"2099-01-01T00:00:00Z", password_set:true, is_admin:false, user:{id:"user-1",email:"member@example.com"} };

test.beforeEach(async({page})=>{
  await page.addInitScript(value=>localStorage.setItem("freeppt-auth",JSON.stringify(value)),session);
  await page.route("**/api/v1/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:session.user,password_set:true,is_admin:false})}));
});

test("signed-in user submits a prompt and attachment to the mocked task API",async({page})=>{
  let createAuthorized=false,authorized=false,uploaded=false,registered=false,submitted=false;
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/jobs/job-1/files/authorize",async route=>{
    authorized=route.request().headers()["x-job-token"]==="job-token";
    expect(await route.request().postDataJSON()).toEqual({original_name:"brief.pdf",content_type:"application/pdf",size_bytes:8});
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({reservation_id:"upload-1",upload_url:"https://blob.test/upload",method:"PUT",headers:{"x-content-type":"application/pdf"}})});
  });
  await page.route("https://blob.test/upload",async route=>{
    uploaded=route.request().method()==="PUT"&&route.request().headers()["x-content-type"]==="application/pdf";
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({url:"https://store.private.blob.vercel-storage.com/inputs/job-1/upload-1/brief.pdf"})});
  });
  await page.route("**/api/v1/jobs/job-1/files",async route=>{
    registered=route.request().headers()["x-job-token"]==="job-token";
    expect(await route.request().postDataJSON()).toEqual({reservation_id:"upload-1",blob_url:"https://store.private.blob.vercel-storage.com/inputs/job-1/upload-1/brief.pdf"});
    await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({id:"file-1"})});
  });
  await page.route("**/api/v1/jobs/job-1/submit",async route=>{
    submitted=route.request().headers()["x-job-token"]==="job-token";
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({message:"job queued"})});
  });
  await page.route("**/api/v1/jobs",async route=>{
    if(route.request().method()==="POST"){
      createAuthorized=route.request().headers().authorization==="Bearer mock-session-token";
      expect(await route.request().postDataJSON()).toEqual({prompt:"Create a quarterly strategy deck",template_slug:"startup-pitch-deck"});
      await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({id:"job-1",job_token:"job-token"})});
    }else await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({jobs:[{id:"job-1",prompt:"Create a quarterly strategy deck",status:"pending",ready_at:"2099-01-01T00:00:00Z",attempts:0,error:null,created_at:"2099-01-01T00:00:00Z",updated_at:"2099-01-01T00:00:00Z",completed_at:null,input_count:1,template_slug:"startup-pitch-deck",downloads:[]}]})});
  });
  await page.goto("/?template=startup-pitch-deck#generator");
  await expect(page.locator(".selected-template").getByText("Startup Pitch Deck",{exact:true})).toBeVisible();
  await page.getByLabel("Presentation brief").fill("Create a quarterly strategy deck");
  await page.locator('input[type="file"]').setInputFiles({name:"brief.pdf",mimeType:"application/pdf",buffer:Buffer.from("mock pdf")});
  await page.getByTestId("generator-submit").click();
  await expect(page).toHaveURL(/\/queue\/?$/);
  await expect(page.getByText("Create a quarterly strategy deck",{exact:true})).toBeVisible();
  expect(createAuthorized).toBe(true);expect(authorized).toBe(true);expect(uploaded).toBe(true);expect(registered).toBe(true);expect(submitted).toBe(true);
});

test("plus menu selects a template and homepage CTA carries it into the generator",async({page})=>{
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:false,waitlist:true})}));
  await page.goto("/");
  await page.getByTestId("generator-tools-toggle").click();
  await page.getByTestId("generator-template-open").click();
  await expect(page.getByRole("dialog",{name:"Choose a presentation style"})).toBeVisible();
  await page.getByTestId("generator-template-company-profile-presentation").click();
  await expect(page.locator(".selected-template").getByText("Company Profile",{exact:true})).toBeVisible();
  await page.getByTestId("home-template-startup-pitch-deck-use").click();
  await expect(page).toHaveURL(/\?template=startup-pitch-deck#generator$/);
  await expect(page.locator(".selected-template").getByText("Startup Pitch Deck",{exact:true})).toBeVisible();
});

test("disabled task submission falls back to mocked trial registration",async({page})=>{
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:false,waitlist:true})}));
  await page.route("**/api/v1/waitlist",async route=>{
    expect(await route.request().postDataJSON()).toEqual({email:"candidate@example.com",locale:"en",source:"generator"});
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({message:"saved"})});
  });
  await page.goto("/");
  await page.getByLabel("Presentation brief").fill("Create a launch deck");
  await page.getByTestId("generator-submit").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByLabel("Email").fill("candidate@example.com");
  await page.getByTestId("coming-soon-waitlist-submit").click();
  await expect(page.getByText("You're on the list. We'll be in touch!")).toBeVisible();
});
