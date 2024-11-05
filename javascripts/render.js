// Chọn phần tử bàn cờ(Phần tử bọc toàn bộ bàn cờ)
const chessPieces = document.querySelector('.chess-pieces');

// Hàm để chèn ảnh vào ô cờ (box: ô cờ, piece: một quân cờ, ví dụ:Wtot, Btot, ...)
const insertImage = (box, piece) => {
    if (piece) { // Kiểm tra nếu có quân cờ trong ô
        const img = document.createElement('img');
        img.classList.add('all-img'); 
        img.src = `./imgs/${piece}.png`; 
        img.alt = piece;
        box.appendChild(img); 
    }
};

// Hàm tô màu cho ô cờ (box: ô cờ)
const chessColor = (box)=>{
    const id = box.id;
    const row = parseInt(id[1], 10);
    const col = parseInt(id[2], 10);
    const sum = row + col;
    box.classList.add(sum % 2 === 0 ? 'box-black' : 'box-white');
};

//tạo ra phần top của bàn cờ gồm các chữ A - H
const topLabels = document.createElement('div');
topLabels.classList.add('top-labels');
['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(label => {
    //tạo ra phần tử bọc từng chữ
    const div = document.createElement('div');
    div.classList.add('label', 'label-top');
    div.textContent = label;
    //thêm vào bên trong topLabels
    topLabels.appendChild(div);
});
// Thêm vào bên trong chessPieces
chessPieces.appendChild(topLabels);

// Hàm tạo các ô cờ(rowNum: hàng của ô cờ, pieces: ô cờ trống)
const createRow = (rowNum) =>{
    //tạo một hàng(đây là phần bọc một hàng cờ) 
    const row = document.createElement('div');
    row.classList.add('div');
    row.id = `row${rowNum}`;

    //tạo nhãn bên trái bàn cờ (số từ 1 -> 8 trên bàn cờ)
    const rowLeft = document.createElement('div');
    rowLeft.classList.add('label', 'label-left');
    rowLeft.textContent = `${rowNum}`;
    row.appendChild(rowLeft);

    // lấy nội dung tương ứng từ dòng 0
    const pieces = rowContent[rowNum - 1];
    // Tạo ô cờ và thêm content cho ô cờ 
    pieces.forEach((piece, index) =>{
        const box = document.createElement('div');
        box.classList.add('box');
        //thêm id sử dụng tham số rowNum, index -> ví dụ: id = 'b81'(dòng 8 cột 1)
        box.id = `b${rowNum}${index + 1}`;
        box.textContent = `${piece}`;

        chessColor(box);
        //pieces sẽ lặp qua và lấy ra nội dung trong rowContent
         // Chèn hình ảnh
         insertImage(box, piece);
        row.appendChild(box);
    });

    // Tạo nhãn bên phải bàn cờ (số từ 1 -> 8 trên bàn cờ)
    const rowRight = document.createElement('div');
    rowRight.classList.add('label', 'label-left');
    rowRight.textContent = `${rowNum}`;
    row.appendChild(rowRight);
   
    //Thêm từng hàng vào bàn cờ
    chessPieces.appendChild(row);
};

//Thiết lập các quân cờ mỗi hàng 
// const rowContent = {
//     8: ['Bxe', 'Bma', 'Btinh', 'Bhau', 'Bvua', 'Btinh', 'Bma', 'Bxe'],
//     7: ['Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot'],
//     6: ['', '', '', '', '', '', '', ''],
//     5: ['', '', '', '', '', '', '', ''],
//     4: ['', '', '', '', '', '', '', ''],
//     3: ['', '', '', '', '', '', '', ''],
//     2: ['Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot'],
//     1: ['Wxe', 'Wma', 'Wtinh', 'Whau', 'Wvua', 'Wtinh', 'Wma', 'Wxe']
// };

const rowContent = [
    ['Bxe', 'Bma', 'Btinh', 'Bhau', 'Bvua', 'Btinh', 'Bma', 'Bxe'],
    ['Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot'],
    ['Wxe', 'Wma', 'Wtinh', 'Whau', 'Wvua', 'Wtinh', 'Wma', 'Wxe']
];

for(let i = 1; i <= 8 ; i++){
    createRow(i);
};

//tạo ra phần top của bàn cờ gồm các chữ A - H
const bottomLabels = document.createElement('div');
bottomLabels.classList.add('bottom-labels');
['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(label => {
    //tạo ra phần tử bọc từng chữ
    const div = document.createElement('div');
    div.classList.add('label', 'label-bottom');
    div.textContent = label;
    //thêm vào bên trong bottomLabels
    bottomLabels.appendChild(div);
});
// Thêm vào bên trong chessPieces
chessPieces.appendChild(bottomLabels);