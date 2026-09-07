import { expect, test } from "@playwright/test";

const session = { token:"admin-token", expires_at:"2099-01-01T00:00:00Z", password_set:true, is_admin:true, user:{id:"admin",email:"admin@example.com"} };

test("administrator sees mocked tasks and trial candidates",async({page})=>{
  await page.addInitScript(value=>localStorage.setItem("freeppt-auth",JSON.stringify(value)),session);
  await page.route("**/api/v1/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:session.user,password_set:true,is_admin:true})}));
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/admin/jobs",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({jobs:[{id:"job-1",prompt:"Investor update",status:"pending",ready_at:"2099-01-01T00:00:00Z",agent_id:null,lease_until:null,attempts:0,max_attempts:3,error:null,created_at:"2099-01-01T00:00:00Z",updated_at:"2099-01-01T00:00:00Z",completed_at:null,user_email:"member@example.com",input_count:2,template_slug:"startup-pitch-deck"}]})}));
  await page.route("**/api/v1/admin/waitlist",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({entries:[{id:"lead-1",email:"candidate@example.com",source:"generator",locale:"zh-CN",created_at:"2099-01-01T00:00:00Z",updated_at:"2099-01-01T00:00:00Z"}]})}));
  await page.goto("/admin");
  await expect(page.getByRole("heading",{name:"FreeAIPPT admin"})).toBeVisible();
  await expect(page.getByText("Investor update",{exact:true})).toBeVisible();
  await expect(page.getByText("candidate@example.com",{exact:true})).toBeVisible();
  await expect(page.getByText("startup-pitch-deck",{exact:true})).toBeVisible();
  await expect(page.getByText("Task submission · ON",{exact:true})).toBeVisible();
});

test("non-admin account is denied by the mocked admin API",async({page})=>{
  await page.addInitScript(value=>localStorage.setItem("freeppt-auth",JSON.stringify(value)),session);
  await page.route("**/api/v1/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:session.user,password_set:true,is_admin:false})}));
  await page.route("**/api/v1/features",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({task_submission:true,waitlist:false})}));
  await page.route("**/api/v1/admin/jobs",route=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:"forbidden"})}));
  await page.route("**/api/v1/admin/waitlist",route=>route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:"forbidden"})}));
  await page.goto("/admin");
  await expect(page.getByRole("heading",{name:"Access denied"})).toBeVisible();
});
