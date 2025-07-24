async function uploadImage() {
    const file = document.getElementById('imageInput').files[0];
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    document.getElementById('result').textContent = 'OCRを実行中...';
  
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
      });
  
      if (!res.ok) throw new Error('サーバーエラー');
  
      const data = await res.json();
      document.getElementById('result').textContent = data.text || '文字が検出されませんでした';
    } catch (err) {
      document.getElementById('result').textContent = `エラーが発生しました: ${err.message}`;
    }
  }