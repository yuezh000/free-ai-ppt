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

for (const viewport of [{width:1280,height:700},{width:390,height:640}]) {
  test(`template picker scrolls to the last item at ${viewport.width}px`,async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.getByTestId("generator-tools-toggle").click();
    await page.getByTestId("generator-template-open").click();
    const list=page.getByTestId("generator-template-list");
    await expect(list).toBeVisible();
    expect(await list.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
    const last=list.locator("button").last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();
    await last.click();
    await expect(page.getByRole("dialog",{name:"Choose a presentation style"})).toHaveCount(0);
    await expect(page.locator(".selected-template")).toBeVisible();
  });
}

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

test("page allowance error is shown without creating a queue item",async({page})=>{
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/jobs",route=>route.fulfill({status:402,contentType:"application/json",body:JSON.stringify({error:"0 free slides remain; payments are coming soon"})}));
  await page.goto("/");
  await page.getByLabel("Presentation brief").fill("Create a 10-slide pitch deck");
  await page.getByTestId("generator-submit").click();
  await expect(page.getByRole("status")).toContainText("0 free slides remain");
  await expect(page).toHaveURL(/\/$/);
});

test("Chinese page allowance error stays localized",async({page})=>{
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/jobs",route=>route.fulfill({status:402,contentType:"application/json",body:JSON.stringify({error:"4 free slides remain; payments are coming soon"})}));
  await page.goto("/zh-CN");
  await page.getByLabel("演示文稿需求").fill("制作六页产品报告");
  await page.getByTestId("generator-submit").click();
  await expect(page.getByRole("status")).toContainText("剩余 4 页免费额度");
});

test("pricing uses pages and free entry reaches the generator",async({page})=>{
  await page.goto("/pricing");
  await expect(page.getByText("100 slides · Save 20%",{exact:true})).toBeVisible();
  await expect(page.getByText("250 slides · Save 40%",{exact:true})).toBeVisible();
  await page.getByTestId("pricing-plan-0-select").click();
  await expect(page).toHaveURL(/\/#generator$/);
  await expect(page.getByLabel("Presentation brief")).toBeVisible();
});

test("completed task exposes a PPTX download and an HTML viewer",async({page})=>{
  let htmlAuthorized=false;
  await page.addInitScript(()=>{
    HTMLAnchorElement.prototype.click=function(){
      (window as typeof window&{__lastOutputLink?:{href:string;target:string;download:string}}).__lastOutputLink={href:this.href,target:this.target,download:this.download};
    };
  });
  await page.route("**/api/v1/jobs",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({jobs:[{id:"job-ready",prompt:"Create a completed deck",status:"completed",ready_at:"2099-01-01T00:00:00Z",attempts:1,error:null,created_at:"2099-01-01T00:00:00Z",updated_at:"2099-01-01T00:00:00Z",completed_at:"2099-01-01T00:05:00Z",input_count:0,template_slug:null,downloads:[{kind:"pptx",url:"/api/v1/jobs/job-ready/downloads/pptx"},{kind:"html",url:"/api/v1/jobs/job-ready/downloads/html"}]}]})}));
  await page.route("**/api/v1/jobs/job-ready/downloads/html",route=>{
    htmlAuthorized=route.request().headers().authorization==="Bearer mock-session-token";
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({url:"https://blob.test/freeaippt-job-ready.html"})});
  });
  await page.route("https://blob.test/freeaippt-job-ready.html",route=>route.fulfill({status:200,contentType:"text/html",body:"<!doctype html><html><body>Presentation</body></html>"}));
  await page.goto("/queue");
  await expect(page.getByTestId("queue-job-ready-download-pptx")).toHaveText(/Download PPTX/);
  await expect(page.getByTestId("queue-job-ready-view-html")).toHaveText(/View HTML/);
  await page.getByTestId("queue-job-ready-view-html").click();
  expect(htmlAuthorized).toBe(true);
  const opened=await page.evaluate(()=>(window as typeof window&{__lastOutputLink?:{href:string;target:string;download:string}}).__lastOutputLink);
  expect(opened).toEqual({href:"https://blob.test/freeaippt-job-ready.html",target:"_blank",download:""});
});
