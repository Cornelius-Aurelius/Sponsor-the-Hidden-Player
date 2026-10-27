const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../assets/kit-lab-core.js');
test('8 educational challenges each have exactly three nonblank options and a valid key',()=>{
 assert.equal(core.QUESTIONS.length,8);assert.equal(new Set(core.QUESTIONS.map(x=>x.id)).size,8);
 for(const q of core.QUESTIONS){assert.equal(q.options.length,3);assert.ok(q.options.every(s=>s.trim().length>12));assert.ok([0,1,2].includes(q.answer));assert.ok(q.why.length>35)}
});
test('all-correct playthrough completes and awards points',()=>{
 let state=core.createState();for(const q of core.QUESTIONS){const r=core.submit(state,q.answer);assert.equal(r.event.correct,true);state=r.state}assert.equal(state.done,true);assert.equal(state.answers.length,8);assert.equal(state.streak,8);assert.equal(state.bestStreak,8);assert.ok(state.score>=800);
});
test('all-wrong playthrough completes without rewards and resets streak',()=>{
 let state=core.createState();for(const q of core.QUESTIONS){const r=core.submit(state,(q.answer+1)%3);assert.equal(r.event.correct,false);state=r.state}assert.equal(state.score,0);assert.equal(state.streak,0);assert.ok(state.done);
});
test('invalid selection does not mutate a game',()=>{const before=core.createState();for(const bad of [-1,3,1.5,NaN,'1']){const x=core.submit(before,bad);assert.equal(x.event,null);assert.deepEqual(x.state,before)}});
test('repeat playthrough starts from fresh state',()=>{let s=core.submit(core.createState(),core.QUESTIONS[0].answer).state;assert.equal(s.round,1);const fresh=core.createState();assert.equal(fresh.round,0);assert.equal(fresh.score,0)});
test('score and best streak never decrease on a correct answer',()=>{let s=core.createState();for(const q of core.QUESTIONS){const next=core.submit(s,q.answer).state;assert.ok(next.score>s.score);assert.ok(next.bestStreak>=s.bestStreak);s=next}});
test('completion is terminal and further answers do not alter state',()=>{let s=core.createState();for(const q of core.QUESTIONS)s=core.submit(s,q.answer).state;const r=core.submit(s,0);assert.strictEqual(r.state,s);assert.equal(r.event,null)});
test('ranking returns understandable titles',()=>{for(const n of [0,100,400,700,1000,1500])assert.ok(core.rank(n).length>5)});