// フォームデータを保存する変数
let formData = {};

// 郵便番号から住所を検索する関数
function searchAddress() {
  const zipInput = document.getElementById('zip');
  const addressInput = document.getElementById('address');
  const zipCode = zipInput.value.replace(/[^0-9]/g, '');
  
  // 郵便番号が7桁でない場合は何もしない
  if (zipCode.length !== 7) {
    return;
  }
  
  // APIリクエスト
  fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 200 && data.results) {
        const result = data.results[0];
        const fullAddress = result.address1 + result.address2 + result.address3;
        addressInput.value = fullAddress;
      } else {
        alert('該当する住所が見つかりませんでした。');
      }
    })
    .catch(error => {
      console.error('住所検索エラー:', error);
      alert('住所の検索に失敗しました。もう一度お試しください。');
    });
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const zipInput = document.getElementById('zip');
  
  // 郵便番号入力時に自動で住所検索
  if (zipInput) {
    zipInput.addEventListener('input', function(e) {
      const zipCode = e.target.value.replace(/[^0-9]/g, '');
      if (zipCode.length === 7) {
        searchAddress();
      }
    });
  }
  
  // フォーム送信時の処理
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // フォームデータを収集
    formData = {
      category: document.getElementById('category').value,
      company: document.getElementById('company').value,
      name: document.getElementById('name').value,
      furigana: document.getElementById('furigana').value,
      tel: document.getElementById('tel').value,
      zip: document.getElementById('zip').value,
      address: document.getElementById('address').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    
    // 確認画面を表示
    showConfirmation();
  });
});

// 確認画面を表示する関数
function showConfirmation() {
  // ページ上部にスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // step-barを更新
  updateStepBar(2);
  
  // フォームコンテナの内容を確認画面に置き換え
  const formContainer = document.querySelector('.form-container');
  
  formContainer.innerHTML = `
    <div class="confirmation-content">
      
      <div class="form-group">
        <div class="form-label-wrapper">
          <label>お問い合わせ種別</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.category}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>会社名</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.company}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>名前</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.name}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>フリガナ</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.furigana}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>電話番号</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.tel}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>郵便番号</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.zip}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>住所</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.address}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>メールアドレス</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value">${formData.email}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <div class="form-group">
        <div class="form-label-wrapper">
          <label>お問い合わせ内容</label>
        </div>
        <div class="form-input-wrapper">
          <p class="confirm-value message-content">${formData.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      <hr class="confirm-divider">

      <p class="confirmation-message">以上の内容で送信します。ご確認のうえ、「この内容で送信する」ボタンを押してください。</p>

      <div class="button-group">
        <button type="button" class="back-button" onclick="showForm()">
          入力内容を修正する
        </button>
        <button type="button" class="submit-button" onclick="submitForm()">
          この内容で送信する
        </button>
      </div>
    </div>
  `;
}

// 入力フォームに戻る関数
function showForm() {
  // step-barを更新
  updateStepBar(1);
  
  // フォームコンテナの内容を元のフォームに戻す
  const formContainer = document.querySelector('.form-container');
  
  formContainer.innerHTML = `
    <form id="contactForm">
      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="category">お問い合わせ種別</label>
        </div>
        <div class="form-input-wrapper">
          <select id="category" name="category" required>
            <option value="">ご依頼</option>
            <option value="見積もり">見積もり依頼</option>
            <option value="資料請求">資料請求</option>
            <option value="その他">その他</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="company">会社名 <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="text" id="company" name="company" placeholder="こちらにご入力ください" required />
          <p class="note">※個人の方は"個人"とご入力ください。</p>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="name">名前 <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="text" id="name" name="name" required />
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="furigana">フリガナ <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="text" id="furigana" name="furigana" required />
          <p class="note">※全角カタカナでご入力ください。</p>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="tel">電話番号 <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="tel" id="tel" name="tel" placeholder="0123456789" required />
          <p class="note">※ハイフン（-）を省いて入力してください。※半角数字でご入力ください。</p>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="zip">郵便番号 <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="text" id="zip" name="zip" placeholder="0200321" required />
          <p class="note">※ハイフン（-）を省いて入力してください。※半角数字でご入力ください。</p>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="address">住所 <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="text" id="address" name="address" placeholder="岩手県盛岡市中央通３丁目１２－２" required />
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="email">メールアドレス <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <input type="email" id="email" name="email" required />
          <p class="note">※半角英数字のみでご入力ください。</p>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label-wrapper">
          <label for="message">お問い合わせ内容 <span class="required">必須</span></label>
        </div>
        <div class="form-input-wrapper">
          <textarea id="message" name="message" rows="8" placeholder="お問い合わせの内容をご入力ください" required></textarea>
        </div>
      </div>

      <div class="submit-button-container">
        <button type="submit" class="submit-button">
          入力内容を確認する
        </button>
      </div>
    </form>
  `;
  
  // フォームデータを復元
  document.getElementById('category').value = formData.category;
  document.getElementById('company').value = formData.company;
  document.getElementById('name').value = formData.name;
  document.getElementById('furigana').value = formData.furigana;
  document.getElementById('tel').value = formData.tel;
  document.getElementById('zip').value = formData.zip;
  document.getElementById('address').value = formData.address;
  document.getElementById('email').value = formData.email;
  document.getElementById('message').value = formData.message;
  
  // 新しいフォームにイベントリスナーを再設定
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // フォームデータを再収集
    formData = {
      category: document.getElementById('category').value,
      company: document.getElementById('company').value,
      name: document.getElementById('name').value,
      furigana: document.getElementById('furigana').value,
      tel: document.getElementById('tel').value,
      zip: document.getElementById('zip').value,
      address: document.getElementById('address').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    
    showConfirmation();
  });
}

// フォームを送信する関数（実際の送信処理は未実装）
function submitForm() {
  // ページ上部にスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // ここに実際の送信処理を実装
  console.log('フォーム送信:', formData);
  
  // step-barを更新
  updateStepBar(3);
  
  // 送信完了画面を表示
  const formContainer = document.querySelector('.form-container');
  formContainer.innerHTML = `
    <div class="completion-content">
      <div class="completion-icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" stroke="#007e43" stroke-width="4"/>
          <path d="M25 40 L35 50 L55 30" stroke="#007e43" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2>お問い合わせいただきありがとうございます。</h2>
      <p class="completion-message">メッセージの送信が完了しました。</p>
      <p class="completion-note">内容を確認後、折り返しご連絡いたしますので、<br>今しばらくお待ちください。</p>
      <div class="top-button-container">
        <a href="../index.html" class="top-button">TOPに戻る</a>
      </div>
    </div>
  `;
}

// step-barを更新する関数
function updateStepBar(activeStep) {
  // すべてのstep-itemからactiveクラスを削除
  document.querySelectorAll('.step-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 指定されたステップにactiveクラスを追加
  document.getElementById(`step${activeStep}-indicator`).classList.add('active');
}
