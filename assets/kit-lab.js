(function(){'use strict';
const $=id=>document.getElementById(id),core=window.KitLabCore;
const lab=$('signal-challenge');if(!lab||!core)return;
let state=core.createState(),locked=false;
const bestKey='ca-kit-lab-best-v2';let best=0;
try{best=Math.max(0,Number(localStorage.getItem(bestKey))||0)}catch(e){}
function show(id,text){const el=$(id);if(el)el.textContent=text;}
function render(){const q=core.QUESTIONS[state.round],answers=$('signal-answers');
 show('signal-best',best.toLocaleString('en-GB'));show('signal-score',state.score.toLocaleString('en-GB'));show('signal-streak',String(state.streak));
 $('signal-progress').style.width=(state.round/core.QUESTIONS.length*100)+'%';
 $('signal-progress').setAttribute('aria-valuenow',String(state.round));
 show('signal-position',state.done?'Complete!':`Decision ${state.round+1} of ${core.QUESTIONS.length}`);
 $('signal-result').hidden=true; $('signal-next').hidden=true; answers.replaceChildren();
 if(state.done){show('signal-topic','Challenge complete');show('signal-prompt',`You scored ${state.score.toLocaleString('en-GB')} points — ${core.rank(state.score)}!`);$('signal-ending').hidden=false;$('signal-finish-copy').textContent=`${state.answers.filter(a=>a.correct).length} of ${state.answers.length} decisions correct. Replay to master the cues.`;return;}
 $('signal-ending').hidden=true;show('signal-topic',q.topic);show('signal-prompt',q.prompt);
 q.options.forEach((option,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='signal-option';btn.textContent=`${i+1}. ${option}`;btn.setAttribute('aria-label',`Option ${i+1}: ${option}`);btn.addEventListener('click',()=>choose(i));answers.append(btn)});
}
function choose(index){if(locked||state.done)return;const current=core.QUESTIONS[state.round];const result=core.submit(state,index);if(!result.event)return;state=result.state;locked=true;
 [...$('signal-answers').children].forEach((button,i)=>{button.disabled=true;if(i===current.answer)button.classList.add('is-correct');if(i===index&&i!==current.answer)button.classList.add('is-wrong')});
 $('signal-result').hidden=false; $('signal-result').className='signal-result '+(result.event.correct?'correct':'incorrect');show('signal-feedback-title',result.event.correct?'Correct decision! +points':'Good learning moment');show('signal-feedback',result.event.why);
 $('signal-next').hidden=false;$('signal-next').textContent=state.done?'See my results':'Next decision';
 show('signal-score',state.score.toLocaleString('en-GB'));show('signal-streak',String(state.streak));
 if(state.score>best){best=state.score;try{localStorage.setItem(bestKey,String(best))}catch(e){}show('signal-best',best.toLocaleString('en-GB'))}
}
$('signal-next').addEventListener('click',()=>{locked=false;render();$('signal-next').hidden=true;if(!state.done){const first=$('signal-answers').querySelector('button');first?.focus()}else $('signal-replay').focus()});
$('signal-replay').addEventListener('click',()=>{state=core.createState();locked=false;render();$('signal-answers').querySelector('button')?.focus()});
// Show genuinely different, highly legible signals. NOT a colour-blindness filter.
const toggle=$('kit-toggle'),diagram=$('kit-pitch');
function setCues(enabled){diagram.dataset.cues=enabled?'on':'off';diagram.setAttribute('aria-label',enabled?'Illustration of two clearly contrasting football kits: one dark striped blue number 12, one light cream number 8.':'Illustration of two similarly bright football kits: red and green, without visible shirt numbers.');toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'Show colour-only example':'Add contrast, shapes & numbers';show('kit-caption',enabled?'IMPROVED: Two teams with different brightness, visible numbers and distinct patterns.':'BEFORE: Similar-brightness kits distinguished mainly by colour.');}
toggle.addEventListener('click',()=>setCues(diagram.dataset.cues!=='on'));
setCues(false);render();
})();