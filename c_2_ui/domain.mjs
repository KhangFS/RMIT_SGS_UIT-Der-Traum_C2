import { randomUUID } from 'node:crypto';
/** Input: status/message. Output: lỗi có HTTP status; chỉ thuộc server rehearsal. */
export function fail(status,message){const error=new Error(message);error.status=status;throw error;}
/** Input: không. Output: store giả lập độc lập trong RAM; KHÔNG cung cấp bảo mật TideCloak. */
export function createStore(){
  let items=[];
  /** Input: request, tên sự kiện. Output: thêm audit event giả lập, không phải audit log chống sửa. */
  function event(item,message){item.events.push({id:randomUUID(),at:new Date().toISOString(),message});}
  /** Input: role. Output: danh tính giả lập hoặc 401. */
  function user(role){if(!['requester','approver'].includes(role))fail(401,'Select a rehearsal workspace.');return {id:`demo-${role}`,name:role==='approver'?'Alex Morgan':'Jamie Chen',role};}
  /** Input: role yêu cầu và role thực tế. Output: tiếp tục hoặc lỗi 403. */
  function requireRole(actual,expected){user(actual);if(actual!==expected)fail(403,'Your role cannot perform this action.');}
  return {
    user,
    list(role){user(role);return structuredClone(items);},
    create(role,payload){
      requireRole(role,'requester');
      if(!Number.isSafeInteger(payload.amountVnd)||payload.amountVnd<=0||payload.amountVnd>1000000000)fail(400,'Enter a whole VND amount between 1 and 1,000,000,000.');
      if(payload.recipientId!=='vendor-demo-001')fail(400,'Unknown demonstration supplier.');
      if(typeof payload.reason!=='string'||!payload.reason.trim()||payload.reason.length>280)fail(400,'Provide a reason of 1–280 characters.');
      // Đề xuất chính sách: mọi khoản cần người duyệt; >10 triệu gắn cờ high value. Không tự bỏ qua khoản nhỏ.
      const item={id:`REQ-${randomUUID().slice(0,8).toUpperCase()}`,actionType:'PAYMENT',status:'PENDING_APPROVAL',requestedBy:'demo-requester',amountVnd:payload.amountVnd,approvalThresholdVnd:10000000,recipientId:payload.recipientId,recipientName:'Demo Office Supplies',invoiceId:'INV-DEMO-001',reason:payload.reason.trim(),executionMode:'SIMULATED',createdAt:new Date().toISOString(),events:[],receipt:null};
      event(item,'Proposal created · awaiting independent approval');items.unshift(item);return structuredClone(item);
    },
    action(role,id,action){
      user(role);const item=items.find(x=>x.id===id);if(!item)fail(404,'Request not found.');
      if(['approve','reject'].includes(action)){
        requireRole(role,'approver');if(item.status!=='PENDING_APPROVAL')fail(409,'This request has already been reviewed.');
        item.status=action==='approve'?'APPROVED':'REJECTED';item.reviewedBy='demo-approver';event(item,action==='approve'?'Rehearsal approval recorded · not a Tide authorization':'Request rejected by approver');
      }else if(action==='execute'){
        requireRole(role,'requester');
        if(item.status==='EXECUTED')return structuredClone(item);
        if(item.status!=='APPROVED'){event(item,'Execution denied · no valid approval');fail(403,'Execution blocked. Independent approval is required.');}
        item.status='EXECUTED';item.receipt={id:`SIM-${randomUUID().slice(0,8).toUpperCase()}`,executedAt:new Date().toISOString(),amountVnd:item.amountVnd,recipientName:item.recipientName};event(item,'Simulated payment completed · no funds transferred');
      }else fail(404,'Action not found.');
      return structuredClone(item);
    },
    reset(role){requireRole(role,'requester');items=[];return {ok:true};}
  };
}
