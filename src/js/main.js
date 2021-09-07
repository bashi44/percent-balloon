'use strict';
const body = document.querySelector('body');

// visus js
window.onload = function() {
  body.classList.remove('hidden');
  new Vivus('pb-top', {
    type: 'oneByOne',
    start: 'inViewport',
    duration: 150,
    forceRender: false,
    animTimingFunction: Vivus.LINEAR,
  }, fin_vivus);
  function fin_vivus() {
    const top = document.querySelector('.top');
    setTimeout(function() {
      top.classList.add('animated');
    }, 1000);
  }
}

// 風船のスタイルをランダムにし、配置をずらす
let balloons = document.querySelectorAll('.balloon');
const colors = [
  '#F82D2B',
  '#0280FB',
  '#F5D570',
  '#FB733C',
  '#04DCF7',
  '#F64DFA'
];
for(let i = 0; i < balloons.length; i ++) {
  if(i >= 0 && i < 10) {
    balloons[i].style.left = 7.6 * i + 8.5 + '%';
  } else if(i >= 10 && i < 20) {
    balloons[i].style.left = 7.6 * (i - 10) + 8.5 + '%';
  } else if(i >= 20 && i < 31) {
    balloons[i].style.left = 7.6 * (i - 20) + 5 + '%';
  } else if(i >= 31 && i < 43) {
    balloons[i].style.left = 7.6 * (i - 31) + 1.5 + '%';
  } else if(i >= 43 && i < 56) {
    balloons[i].style.left = 7.6 * (i - 43) - 2 + '%';
  } else if(i >= 56 && i < 68) {
    balloons[i].style.left = 7.6 * (i - 56) + 1.5 + '%';
  } else if(i >= 68 && i < 79) {
    balloons[i].style.left = 7.6 * (i - 68) + 5 + '%';
  } else if(i >= 79 && i < 90) {
    balloons[i].style.left = 7.6 * (i - 79) + 5 + '%';
  } else {
    balloons[i].style.left = 7.6 * (i - 90) + 8.5 + '%';
  }
  balloons[i].style.backgroundColor = colors[Math.floor(Math.random() * 6) + 1 - 1];
}
// 風船にランダムな動きをつける
const shuffle = ([...array]) => {
  for (let f = array.length - 1; f >= 0; f--) {
    const j = Math.floor(Math.random() * (f + 1));
    [array[f], array[j]] = [array[j], array[f]];
  }
  return array;
}
let shuffled_balloons = shuffle(balloons);
const animations = [
  'up-down',
  'down-up',
  'right-left',
  'left-right',
  'up-down-side'
];
shuffled_balloons.forEach(function(shuffled_balloon) {
  shuffled_balloon.classList.add(animations[Math.floor(Math.random() * 5) + 1 - 1]);
})

// テスト制作のため問題はjavascriptで定義
// 本番はカスタムテーブルの値で行う
const questions = [
  {
    question: '連休より離れた休みが欲しい人は何％？',
    answer: '41'
  },
  {
    question: '温水洗浄便座 出先では使わない人は何％？',
    answer: '26'
  },
  {
    question: 'お酒が好きな人 缶ビールをグラスやジョッキに注ぐ人は何％？',
    answer: '77'
  },
  {
    question: '緊急事態宣言下で、テレワークを実践した人は何％？',
    answer: '60'
  },
  {
    question: 'おしぼりで顔は拭かない人は何％？',
    answer: '57'
  }
];

// 要素の取得
const confirm_area = document.querySelector('.confirm-area');
const result = document.querySelector('.result');
const correct_percent = document.querySelector('.correct-percent');
const difference_percent = document.querySelector('.difference-percent');
const next_btn = document.querySelector('.next-btn');
const animation_bar = document.querySelector('.animation-bar');
const answer_bar = document.querySelector('.answer-bar');
const question = document.querySelector('.question');
const question_num = document.querySelector('.question-num');
const a_input = document.querySelector('.a-input');
const a_btn = document.querySelector('.a-btn');
const last_balloons = document.querySelector('.last-balloons');
// 変数定義
let c = 1;
let last_balloons_count = 100;
let difference = 0;
let a_value;
let answer;
let clone_balloon;

// 最初の問題を描画
question.textContent = questions[0].question;

// 入力値のバリデーション
a_input.addEventListener('input', function() {
  if(isNaN(a_input.value) || parseInt(a_input.value) < 0 || parseInt(a_input.value) > 100 || a_input.value === '') {
    a_btn.disabled = true;
    a_btn.classList.add('disabled');
  } else {
    a_btn.disabled = false;
    a_btn.classList.remove('disabled');
  }
});

// ゲーム処理
a_btn.addEventListener('click', function() {
  a_btn.disabled = true;
  a_btn.classList.add('disabled');
  a_value = parseInt(a_input.value);
  answer = parseInt(questions[c - 1].answer);
  // 入力された答えの位置を明示
  answer_bar.style.left = a_value + '%';
  answer_bar.style.opacity = '1';
  // パーセントバーアニメーション
  animation_bar.classList.add('animation-now');
  animation_bar.addEventListener('animationend', p_animationend);
});

// パーセントバーアニメーション
function p_animationend() {
  animation_bar.style.width = questions[c - 1].answer + '%';
  // 正解との差を計算
  if(a_value < answer) {
    difference = answer - a_value;
  } else if(a_value > answer) {
    difference = a_value - answer;
  }
  last_balloons_count -= difference;
  // 風船が飛んでいくアニメーション
  // 誤差：1以上 残り風船：1以上
  if(difference !== 0 && last_balloons_count > 0) {
    for(let i = 0; i < difference; i ++) {
      shuffled_balloons[i].classList.remove('not-away');
      shuffled_balloons[i].classList.add('away');
      if(i === difference - 1) {
        shuffled_balloons[i].addEventListener('animationend', b_animationend);
        clone_balloon = shuffled_balloons[i];
      }
    }
  // 誤差：1以上 残り風船：0以下
  } else if(difference !== 0 && last_balloons_count <= 0) {
    for(let i = 0; i < shuffled_balloons.length; i ++) {
      shuffled_balloons[i].classList.remove('not-away');
      shuffled_balloons[i].classList.add('away');
      if(i === shuffled_balloons.length - 1) {
        shuffled_balloons[i].addEventListener('animationend', b_animationend);
        clone_balloon = shuffled_balloons[i];
      }
    }
  // 誤差：0 残り風船：1以上
  } else {
    result.textContent = 'PERFECT!!!';
    b_animationend();
  }
}

// 風船アニメーション
function b_animationend() {
  // 残った風船を取得
  balloons = document.querySelectorAll('.balloon');
  shuffled_balloons = shuffle(shuffled_balloons);
  shuffled_balloons = Array.from(shuffled_balloons).filter(shuffled_balloon => shuffled_balloon.classList.contains('away') === false);
  // 風船の残数を明示
  if(last_balloons_count > 0) {
    last_balloons.textContent = '🎈' + last_balloons_count;
  } else {
    last_balloons.textContent = '🎈' + '0';
  }
  correct_percent.textContent = '正解：' + questions[c - 1].answer + '%';
  difference_percent.textContent = '誤差：' + difference + '%';
  confirm_area.classList.remove('hidden');
  // 風船：残っている・問題：残っている
  if(last_balloons_count > 0 && c < questions.length) {
    next_btn.value = '次の問題へ';
    next_btn.addEventListener('click', go_next);
  // 風船：残っている・問題：残っていない
  } else if(last_balloons_count > 0 && c === questions.length) {
    result.textContent = 'CLEAR!!!';
    next_btn.value = '再挑戦';
    next_btn.addEventListener('click', function() {
      location.reload();
    })
  // 風船：残っていない・問題：残っている
  } else {
    result.textContent = 'GAMEOVER';
    next_btn.value = '再挑戦';
    next_btn.addEventListener('click', function() {
      location.reload();
    })
  }
}

// 次の問題へ
function go_next() {
  c ++;
  question.textContent =  questions[c - 1].question;
  question_num.textContent = 'Q.' + c;
  init();
}

// 初期化
function init() {
  a_input.value = '';
  animation_bar.classList.remove('animation-now');
  answer_bar.style.left = '0';
  answer_bar.style.opacity = '0';
  animation_bar.style.width = '0';
  difference = 0;
  confirm_area.classList.add('hidden');
  result.textContent = '';
  animation_bar.removeEventListener('click', p_animationend);
  if(difference !== 0) {
    clone_balloon.removeEventListener('click', b_animationend);
  }
}
