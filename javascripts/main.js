//Menu
const playWithPlayerBtn = document.getElementById('play-with-player');
const playWithAiBtn = document.getElementById('play-with-ai');
const scoreBtn = document.getElementById('score');
const backToMenuBtn = document.getElementById('back-to-menu');
const openSettingsBtn = document.querySelector('.open-settings-btn');
const settings = document.getElementById('settings');
const settingsContainer = document.querySelector('.settings-container');
const backHomeBtn = document.getElementById('back-home');

// cảnh báo
const warningBox = document.querySelector('.warning');
const warningText = document.querySelector('.warn-text');

// Các phần tử giao diện chính
const chessWrapper = document.querySelector('.chess-wrapper');
const menuContainer = document.querySelector('.menu-container');
const scoreContainer = document.querySelector('.score-container');
const menuList = document.querySelector('.menu-list');
// Phát âm thanh
const moveSound = document.getElementById("moveSound");
const capturedSound = document.getElementById("capturedSound");

//volume
const volumeControl  = document.getElementById('volume-control');
volumeControl .addEventListener('input', (event) => {
    const volume = event.target.value / 100;
    moveSound.volume = volume;
});
moveSound.volume = volumeControl.value / 100;
// Ẩn menu và hiển thị bàn cờ khi nhấn "Chơi với Người"
playWithPlayerBtn.addEventListener('click', () => {
    statusAI = false;
    moveSound.play();
    chessWrapper.classList.remove('hidden');
    menuContainer.classList.add('hidden');
    resetGame();
});

playWithAiBtn.addEventListener('click', (e) => {
    statusAI = true;
    moveSound.play();
    chessWrapper.classList.remove('hidden');
    menuContainer.classList.add('hidden');
    resetGame();
    // showUpdate('Đang cập nhật!');
    // setTimeout(() => {
    //     updateBox.classList.add('hidden');
    // }, 3000);
});

const updateBox = document.querySelector('.update');
const updateText = document.querySelector('.update-text')
const showUpdate = (message) => {
    updateBox.classList.remove('hidden');
    updateText.textContent = message; // Cập nhật văn bản cảnh báo
    updateBox.style.display = 'flex'; // Hiển thị hộp cảnh báo
};

settings.addEventListener('click' , () => {
    showUpdate('Đang cập nhật!');
    setTimeout(() => {
        updateBox.classList.add('hidden');
    }, 2000);
});

// Quay lại menu chính từ phần điểm số
backToMenuBtn.addEventListener('click', () => {
    moveSound.play();
    scoreContainer.classList.add('hidden');
    menuList.classList.remove('hidden');
});

// Bật/tắt cài đặt khi nhấn vào nút icon răng cưa
openSettingsBtn.addEventListener('click', (e) => {
    moveSound.play();
    settingsContainer.classList.toggle('hidden');
    e.stopPropagation();
});

// Ẩn cài đặt khi nhấn "Quay lại Trang Chủ"
backHomeBtn.addEventListener('click', () => {
    moveSound.play();
    resetGame();
    stopScore();
    settingsContainer.classList.add('hidden');
    chessWrapper.classList.add('hidden');
    menuContainer.classList.remove('hidden');
});

//Ẩn setting 
chessWrapper.addEventListener('click', () => {
    settingsContainer.classList.add('hidden');
});

settingsContainer.addEventListener('click', e => {
    e.stopPropagation();
});

//phong tốt
let isPromoting = false;
//Trạng thái di chuyển
let whiteKingMoved = false;
let blackKingMoved = false;
let whiteRookLeftMoved = false;
let whiteRookRightMoved = false;
let blackRookLeftMoved = false;
let blackRookRightMoved = false;
// Biến theo dõi trạng thái kết thúc trò chơi
let isGameOver = false;
// Biến lưu điểm
let scoreInterval; //điểm khi sử dụng setInterval
let whiteScore = 5000;
let blackScore = 5000;

// Lưu vị trí quân tốt có thể bị ăn qua sông
let enPassantTarget = null; 

// //Biến lưu mảng đường đi hợp lệ
let pathSs = [];
// Biến kiểm tra chế độ chơi
let statusAI = false;
// Lấy phần tử giao diện để hiển thị điểm số
const scoreElements = document.querySelectorAll('.score');
const whiteScoreElement = scoreElements[0];
const blackScoreElement = scoreElements[1];

let highestScore = 0; // Biến lưu điểm cao nhất
let lastScore = 0; // Biến lưu điểm ván trước

const highestScoreElement = document.getElementById('highest-score');
const lastScoreElement = document.getElementById('last-score');

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
// Hàm tạo phần top của bàn cờ
const createTopLabels = () =>{
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(label => {
        //tạo ra phần tử bọc từng chữ
        const div = document.createElement('div');
        div.classList.add('label', 'label-top');
        div.textContent = label;
        //thêm vào bên trong topLabels
        topLabels.appendChild(div);
    });
};
createTopLabels();
// Thêm vào bên trong chessPieces
chessPieces.appendChild(topLabels);

//Tạo ra mảng các quân cờ mỗi hàng 
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

// Lặp qua mảng 2 chiều để tạo các ô cờ
const createRow = () =>{
    rowContent.forEach((row, rowIndex) => {
        const rowNum = 8 - rowIndex; // Đảo ngược thứ tự để hàng 8 ở trên cùng
    
        // Tạo phần tử hàng
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('div');
        rowDiv.id = `row${rowNum}`;
    
        // Tạo nhãn bên trái bàn cờ (số từ 1 -> 8 trên bàn cờ)
        const rowLeft = document.createElement('div');
        rowLeft.classList.add('label', 'label-left');
        rowLeft.textContent = `${rowNum}`;
        rowDiv.appendChild(rowLeft);
    
        // Lặp qua từng ô trong hàng
        row.forEach((piece, colIndex) => {
            const box = document.createElement('div');
            box.classList.add('box');
            // Đặt id cho ô (ví dụ: b81 cho hàng 8, cột 1)
            box.id = `b${rowNum}${colIndex + 1}`;
            box.textContent = piece;
    
            chessColor(box); // Tô màu cho ô
            insertImage(box, piece); // Chèn hình ảnh vào ô
            rowDiv.appendChild(box);
        });
    
        // Tạo nhãn bên phải bàn cờ (số từ 1 -> 8 trên bàn cờ)
        const rowRight = document.createElement('div');
        rowRight.classList.add('label', 'label-left');
        rowRight.textContent = `${rowNum}`;
        rowDiv.appendChild(rowRight);
    
        // Thêm hàng vào bàn cờ
        chessPieces.appendChild(rowDiv);
    });
}
createRow();

//tạo ra phần top của bàn cờ gồm các chữ A - H
const bottomLabels = document.createElement('div');
bottomLabels.classList.add('bottom-labels');
// Hàm tạo phần bottom của bàn cờ
const createBottomLabels = () => {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(label => {
        //tạo ra phần tử bọc từng chữ
        const div = document.createElement('div');
        div.classList.add('label', 'label-bottom');
        div.textContent = label;
        //thêm vào bên trong bottomLabels
        bottomLabels.appendChild(div);
    });
}
createBottomLabels();

const boxElements = document.querySelectorAll('.box');
// Thêm vào bên trong chessPieces
chessPieces.appendChild(bottomLabels);

//Hàm ngăn quân cờ cùng màu không tấn công lẫn nhau
const prevent = ()=>{
    //Duyệt qua các ô để tìm quân cờ được chọn
    boxElements.forEach(b1 =>{
       if(b1.classList.contains('focus-piece')){
            //Lấy thông tin về màu của quân cờ được chọn
            const focusText = b1.innerText;
            const focusColor = focusText.charAt(0);
            //Duyệt qua các ô có thể là đường đi
            boxElements.forEach(b2 =>{
                if(b2.classList.contains('path-color') && b2.innerText.length !==0 ){
                    //Kiểm tra xem có quân cờ cùng màu ở ô đích không
                    const pathText = b2.innerText;
                    const pathColor = pathText.charAt(0);
                    if(focusColor === pathColor){
                        //Loại bỏ đường đi không hợp lệ và khôi phục màu sắc của ô
                        const id = b2.id;
                        const row = parseInt(id[1], 10);
                        const col = parseInt(id[2], 10);
                        const sum = row + col;
                        b2.classList.remove('path-color');
                        if(sum % 2 === 0){
                            b2.classList.add('box-black');
                        }
                        else{
                            b2.classList.add('box-white');
                        }
                    }
                }
            })
       }
    });
};
//Biến lượt đi (lẻ là cờ trắng di chuyển, chẵn là cờ đen di chuyển)
let tog = 1;
// Hàm gán gán sự kiện click trên tất cả các ô trên bàn cờ
const addEventListeners = () => {
    boxElements.forEach(item => {
        item.addEventListener('click', () => handleMoveItem(item)); 
    });
};
// const random = (arrElement,toggle) => {
//     arrElement
//     handleMoveItem(item)
// };

addEventListeners();

//
const handleMoveItem = (item)=>{
    //kiểm tra xem trò chơi đã kết thúc (isGameOver) hoặc có quân cờ đang phong cấp (isPromoting) hay không
    if (isGameOver || isPromoting) return;

    //Lấy id của ô được click (bỏ đi ký tự đầu tiên). Ví dụ id: 'b81' bỏ 'b' đi => id = '81'
    const id = item.id.slice(1);
    console.log(id);
    //Xác định quân cờ hợp lệ dựa trên toggle(có thể là "W" cho quân trắng hoặc "B" cho quân đen).
    const whosTurn = (toggle)=>{
        //Mỗi một ô cờ chứa quân cờ sẽ có một text(để font-size:0, ví dụ: Wtot, Wxe,...)
        //Từ đó có thể lấy ra con cờ tương ứng dựng trên innerText của ô đó
        // Quân tốt
        if (item.innerText == `${toggle}tot`) {
            clearState();//Xóa trạng thái cũ(Các màu cũ đã tô trên bàn cờ )
            item.classList.add('focus-piece');//Đánh dấu quân cờ đã chọn
            moveSound.play();//phát âm thanh
            movePawn(id, toggle);//Tô màu đường đi hợp lệ của quân tốt
        }

        //Tương tự các quân cờ
        //Xe
        if(item.innerText == `${toggle}xe`){
            clearState();
            item.classList.add('focus-piece');
            moveSound.play();
            moveRook(id);
        }
        //mã
        if(item.innerText == `${toggle}ma`){
            clearState();
            item.classList.add('focus-piece');
            moveSound.play();
            moveKnight(id);
        }
        //Tịnh
        if (item.innerText == `${toggle}tinh`) {
            clearState(); 
            item.classList.add('focus-piece'); 
            moveSound.play();
            moveBishop(id);
        }
        //Hậu
        if (item.innerText == `${toggle}hau`) {
            clearState(); 
            item.classList.add('focus-piece');
            moveSound.play();
            moveQueen(id); 
        }
        //Vua
        if (item.innerText == `${toggle}vua`) {
            clearState(); 
            item.classList.add('focus-piece');
            moveSound.play();
            castle(toggle);
            moveKing(id); 
            
        }
    }

    //Lượt đi của người chơi (tog)
    tog % 2 !== 0 ? whosTurn('W') : whosTurn('B');
    //prevent được gọi để ngăn các nước đi đến các ô có quân cờ cùng màu
    prevent();
};

// Hàm tô màu đường đi hợp lệ của con tốt
// startid là id của một ô được click(đã được cắt kí tự 'b' ở đầu)
// toggle là màu của quân cờ ('W' là màu trắng, 'B' là màu đen)
// Ví dụ startid: '21', toggle : 'W'
const movePawn = (startid, toggle) => {
    
    let row = parseInt(startid[0], 10); //Lấy dòng (ví dụ row = 2)
    const col = parseInt(startid[1], 10); //Lấy cột (ví dụ col = 1)
    const top = parseInt(startid, 10); //Lấy id (ví dụ top = 21)
    pathSs = [];
    // Dựa trên tog (lượt đi), xác định hướng di chuyển
    // moveDirection là quy tắc di chuyển của con tốt 
    // Quân trắng đi lên (+10), quân đen đi xuống (-10)
    const moveDirection = (tog % 2 !== 0) ? 10 : -10;
    // startRow: xác định hàm xuất phát (hàng 2: quân trắng, hàng 7: quân đen )
    const startRow = (tog % 2 !== 0) ? 2 : 7;

    // Kiểm tra nước đi thẳng(đi 1 ô)
    // b${top + moveDirection}: id của ô di chuyển hợp lệ .
    const nextBox = document.getElementById(`b${top + moveDirection}`);
    //Kiểm tra nếu nextBox tồn tại và trống
    if (nextBox && nextBox.innerText.length == 0) {
        nextBox.classList.add('path-color'); // Đánh dấu đường đi hợp lệ
        pathSs.push(nextBox);

        //Kiểm tra nước đi hai ô từ hàng xuất phát
        //Lấy ô cách hai ô từ vị trí hiện tại(b${top + moveDirection * 2})
        if (row === startRow) {
            const doubleStepBox = document.getElementById(`b${top + moveDirection * 2}`);
            if (doubleStepBox && doubleStepBox.innerText.length == 0) {
                doubleStepBox.classList.add('path-color');
                pathSs.push(doubleStepBox);
            }
        }
        //Kiểm tra thăng cấp quân tốt
        //Tính hàng mới mà quân tốt sẽ đến nếu đi lên một ô
        const newRow = row + (moveDirection / 10);
        //Nếu hàng mới là 8 (quân trắng) hoặc 1 (quân đen), quân tốt cần được thăng cấp
        if ((newRow === 8 && toggle === 'W') || (newRow === 1 && toggle === 'B')) {
            nextBox.addEventListener('click', () => promotePiece(nextBox, toggle), { once: true });
        }
    }

    //Kiểm tra nếu quân tốt không ở cột đầu tiên (mép bàn cờ) để có thể ăn trái
    if (col > 1) {
        //Lấy ô phía trên bên trái của quân tốt
        const captureLeft = document.getElementById(`b${top + moveDirection - 1}`);
        //Lấy ô bên trái quân tốt (dùng để kiểm tra ăn chốt được không).
        const enPassantLeft = document.getElementById(`b${row}${col - 1}`);
        //Kiểm tra ăn quân thông thường bên trái
        if (captureLeft && captureLeft.innerText.length !== 0) {
            captureLeft.classList.add('path-color');//Đánh dấu quân ở bên trái
            pathSs.push(captureLeft);//Lưu ô là đường đi hợp lệ
            const newRow = row + (moveDirection / 10);
            if ((newRow === 8 && toggle === 'W') || (newRow === 1 && toggle === 'B')) {
                console.log('phong cấp')
                captureLeft.addEventListener('click', () => promotePiece(captureLeft, toggle), { once: true });
            }
        }
        // Ăn chốt qua đường
        else if (
            //Kiểm tra xem quân cờ bên trái có phải là của đối phương không 
            enPassantLeft &&
            enPassantLeft.innerText.startsWith(toggle === 'W' ? 'B' : 'W') &&
            // Kiểm tra xem nó có phải lần đầu di chuyển không 
            //enPassantTarget: lưu lại vị trí của quân tốt có thể bị ăn qua đường
            enPassantTarget &&
            enPassantTarget.row === row &&
            enPassantTarget.col === col - 1
        ) {
            captureLeft.classList.add('path-color');//Đánh dấu ô bị ăn 
            pathSs.push(captureLeft);//Lưu ô là đường đi hợp lệ
            captureLeft.addEventListener('click', () => {
                // Thực hiện nước đi En Passant bên trái
                document.getElementById(`b${row}${col - 1}`).innerText = ''; // Xóa quân tốt bị ăn
                captureLeft.innerText = `${toggle}tot`; // Di chuyển quân tốt của người chơi
                insertImage(captureLeft,captureLeft.innerText);
                
                enPassantTarget = null; // Reset trạng thái
                clearState();
            }, { once: true });
        }
        
    }
    // Tương tự bên phải
    if (col < 8) {
        const captureRight = document.getElementById(`b${top + moveDirection + 1}`);
        const enPassantRight = document.getElementById(`b${row}${col + 1}`);
        if (captureRight && captureRight.innerText.length !== 0) {
            captureRight.classList.add('path-color');
            pathSs.push(captureRight);
        }// Kiểm tra En Passant bên phải
        else if (
            enPassantRight &&
            enPassantRight.innerText.startsWith(toggle === 'W' ? 'B' : 'W') &&
            enPassantTarget &&
            enPassantTarget.row === row &&
            enPassantTarget.col === col + 1
        ) {
            captureRight.classList.add('path-color');
            pathSs.push(captureRight);
            captureRight.addEventListener('click', () => {
                // Thực hiện nước đi En Passant bên phải
                document.getElementById(`b${row}${col + 1}`).innerText = ''; // Xóa quân tốt bị ăn
                captureRight.innerText = `${toggle}tot`; // Di chuyển quân tốt của người chơi
                insertImage(captureRight, captureRight.innerText);
                
                enPassantTarget = null; // Reset trạng thái
                clearState();
            }, { once: true });
        }
        
    }
    
};

//Hàm tô màu những đường đi hợp lệ của con xe (startId: id của ô có chứa xe được click)
const moveRook = ( startId)=>{
    
    const startRow = parseInt(startId[0], 10); //Lấy hàng
    const startCol = parseInt(startId[1], 10); //Lấy cột
    pathSs = [];
    // Các hướng di chuyển của quân Xe (lên, xuống, trái, phải)
    const directions = [
        [1, 0],
        [-1, 0], 
        [0, 1], 
        [0, -1]
    ];
    //Duyệt qua từng hướng di chuyển
    directions.forEach(([rowStep, colStep]) =>{
        for(let i = 1; i < 9; i++){
            //Tính hàng và cột mới bằng cách cộng (hoặc trừ) i * rowStep và i * colStep
            const newRow = startRow + i * rowStep;
            const newCol = startCol + i * colStep;
            //Nếu tọa độ mới vượt ra ngoài giới hạn của bàn cờ (1 đến 8), vòng lặp dừng lại
            if (newRow < 1 || newRow > 8 || newCol < 1 || newCol > 8) break;
            
            //newPosition: Tạo ID cho ô mới bằng cách nối chuỗi "b" với newRow và newCol
            const newPosition = `b${newRow}${newCol}`;
            const element = document.getElementById(newPosition);
            //Nếu ô không tồn tại, vòng lặp dừng lại
            if(!element ) break;
            //Xử lý khi ô mới trống hoặc có quân cờ
            if(element.innerText.length === 0){
                element.classList.add('path-color');
                pathSs.push(element);
            }
            else{
                element.classList.add('path-color');
                pathSs.push(element);
                break;
            }
        };
    });
};

// Hàm đánh dấu đường đi quân mã trên bàn cờ
const moveKnight = (startId) => {
    
    // Tách hàng và cột từ `startId` (vị trí bắt đầu của quân mã)
    const startRow = parseInt(startId[0], 10); // Hàng của vị trí bắt đầu
    const startCol = parseInt(startId[1], 10); // Cột của vị trí bắt đầu
    pathSs = [];
    // Các bước di chuyển hợp lệ của quân mã trên bàn cờ
    const moves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    
    // Duyệt qua từng bước di chuyển hợp lệ của quân mã
    moves.forEach(([rowStep, colStep]) => {
        // Tính toán vị trí hàng và cột mới sau mỗi bước di chuyển
        const newRow = startRow + rowStep;
        const newCol = startCol + colStep;
        
        
        // Kiểm tra xem vị trí mới có nằm trong bàn cờ (1 <= hàng, cột <= 8) hay không
        if (newRow >= 1 && newRow <= 8 && newCol >= 1 && newCol <= 8) {
            // Xây dựng ID mới cho vị trí bàn cờ theo dạng `b[row][col]`
            const newPosition = `b${newRow}${newCol}`;
            
            // Tìm phần tử HTML tương ứng với ID vị trí mới
            const element = document.getElementById(newPosition);
            
            // Nếu phần tử tồn tại, thêm class `path-color` để làm nổi bật nước đi hợp lệ
            if (element) {
                element.classList.add('path-color');
                pathSs.push(element);
            }
        }
    });
};

// Hàm đánh dấu đường đi quân tượng trên bàn cờ
const moveBishop = (startId) => {
    
    // Tách hàng và cột từ `startId` (vị trí bắt đầu của quân tượng)
    const startRow = parseInt(startId[0], 10); // Hàng của vị trí bắt đầu
    const startCol = parseInt(startId[1], 10); // Cột của vị trí bắt đầu
    pathSs = [];
    // Các hướng di chuyển hợp lệ của quân tượng trên bàn cờ (đường chéo)
    const directions = [
        [1, 1],   
        [1, -1],   
        [-1, 1], 
        [-1, -1]   
    ];

    // Duyệt qua từng hướng di chuyển hợp lệ của quân tượng
    directions.forEach(([rowStep, colStep]) => {
        // Quân tượng có thể đi xa nhiều ô trên mỗi hướng, vì vậy sử dụng vòng lặp để kiểm tra từng ô
        for (let i = 1; i < 9; i++) {
            // Tính toán vị trí hàng và cột mới sau mỗi bước đi trong hướng hiện tại
            const newRow = startRow + i * rowStep;
            const newCol = startCol + i * colStep;

            // Kiểm tra nếu vị trí mới nằm ngoài giới hạn bàn cờ (1 <= hàng, cột <= 8), nếu có thì dừng lại
            if (newRow < 1 || newRow > 8 || newCol < 1 || newCol > 8) break;

            // Xây dựng ID mới cho vị trí bàn cờ theo dạng `b[row][col]`
            const newPosition = `b${newRow}${newCol}`;
            
            // Tìm phần tử HTML tương ứng với ID vị trí mới
            const element = document.getElementById(newPosition);

            // Nếu không tìm thấy phần tử HTML (có thể là lỗi hoặc ngoài bàn cờ), dừng lại
            if (!element) break;

            // Nếu ô trống, thêm class `path-color` để làm nổi bật đường đi hợp lệ
            if (element.innerText.length === 0) {
                element.classList.add('path-color');
                pathSs.push(element);
            } else {
                // Nếu ô có quân cờ (innerText không trống), thêm class `path-color` và dừng lại, vì không thể đi qua quân cờ
                element.classList.add('path-color');
                pathSs.push(element);
                break; 
            }
        }
    });
};

// Hàm đánh dấu đường đi hợp lệ quân hậu trên bàn cờ
const moveQueen = (startId) => {
    
    // Tách hàng và cột từ `startId` (vị trí bắt đầu của quân hậu)
    const startRow = parseInt(startId[0], 10); // Hàng của vị trí bắt đầu
    const startCol = parseInt(startId[1], 10); // Cột của vị trí bắt đầu
    pathSs = [];
    // Các hướng di chuyển hợp lệ của quân hậu trên bàn cờ (kết hợp cả ngang, dọc, và chéo)
    const directions = [
        [1, 0],  
        [-1, 0], 
        [0, 1],  
        [0, -1], 
        [1, 1], 
        [1, -1],  
        [-1, 1],  
        [-1, -1]  
    ];

    // Xác định quân cờ hiện tại (quân hậu) để kiểm tra xem quân ở ô khác có phải là quân đối phương không
    const focusPiece = document.getElementById(`b${startId}`).innerText;

    // Duyệt qua từng hướng di chuyển hợp lệ của quân hậu
    directions.forEach(([rowStep, colStep]) => {
        // Quân hậu có thể đi xa nhiều ô trong mỗi hướng, vì vậy sử dụng vòng lặp để kiểm tra từng ô
        for (let i = 1; i < 9; i++) {
            // Tính toán vị trí hàng và cột mới sau mỗi bước đi trong hướng hiện tại
            const newRow = startRow + i * rowStep;
            const newCol = startCol + i * colStep;

            // Kiểm tra nếu vị trí mới nằm ngoài giới hạn bàn cờ (1 <= hàng, cột <= 8), nếu có thì dừng lại
            if (newRow < 1 || newRow > 8 || newCol < 1 || newCol > 8) break;

            // Xây dựng ID mới cho vị trí bàn cờ theo dạng `b[row][col]`
            const newPosition = `b${newRow}${newCol}`;
            
            // Tìm phần tử HTML tương ứng với ID vị trí mới
            const element = document.getElementById(newPosition);

            // Nếu không tìm thấy phần tử HTML (có thể là lỗi hoặc ngoài bàn cờ), dừng lại
            if (!element) break;

            // Lấy thông tin về quân cờ (nếu có) tại vị trí mới
            const newPiece = element.innerText;

            // Nếu ô trống, thêm class `path-color` để làm nổi bật đường đi hợp lệ
            if (newPiece.length === 0) {
                element.classList.add('path-color');
                pathSs.push(element);
            } 
            // Nếu ô chứa quân đối phương, thêm class `path-color` và dừng lại
            else if (isOpponentPiece(focusPiece, newPiece)) {
                element.classList.add('path-color');
                pathSs.push(element);
                break;
            } 
            // Nếu ô chứa quân của mình, dừng lại
            else {
                break;
            }
        }
    });
};


// Hàm kiểm tra xem ô có chứa quân đối phương hay không
const isOpponentPiece = (focusPiece, newPiece) => {
    // Điều kiện: 
    // 1. `newPiece.length !== 0`: Đảm bảo ô mới không trống (có quân cờ).
    // 2. `newPiece[0] !== focusPiece[0]`: Kiểm tra xem quân cờ ở ô mới có cùng màu với quân cờ ban đầu không.
    //    - Ký tự đầu tiên của `focusPiece` và `newPiece` biểu thị màu quân cờ (ví dụ: 'W' cho trắng, 'B' cho đen).
    //    - Nếu khác màu, `newPiece` là quân của đối phương.
    return newPiece.length !== 0 && newPiece[0] !== focusPiece[0];
};

// Hàm đánh dấu đường đi hợp lệ quân vua trên bàn cờ
const moveKing = (startId) => {
    
    // Lấy phần tử HTML của ô chứa quân vua và nội dung quân cờ tại ô đó
    const kingElement = document.getElementById(`b${startId}`);  
    const focusPiece = kingElement.innerText; // Quân vua tại vị trí bắt đầu
    const startRow = parseInt(startId[0], 10); // Hàng của vị trí bắt đầu
    const startCol = parseInt(startId[1], 10); // Cột của vị trí bắt đầu
    pathSs = [];

    // Các hướng di chuyển hợp lệ của quân vua (ngang, dọc, và chéo, mỗi hướng một ô)
    const directions = [
        [1, 0],   
        [-1, 0],  
        [0, 1],   
        [0, -1],  
        [1, 1],  
        [1, -1],
        [-1, 1],
        [-1, -1] 
    ];

    // Duyệt qua từng hướng di chuyển hợp lệ của quân vua
    directions.forEach(([rowStep, colStep]) => {
        // Tính toán vị trí hàng và cột mới cho quân vua
        const newRow = startRow + rowStep;
        const newCol = startCol + colStep;

        // Kiểm tra nếu vị trí mới nằm ngoài giới hạn bàn cờ (1 <= hàng, cột <= 8), bỏ qua
        if (newRow < 1 || newRow > 8 || newCol < 1 || newCol > 8) return;

        // Xây dựng ID cho vị trí mới theo dạng `b[row][col]`
        const newPosition = `b${newRow}${newCol}`;
        
        // Tìm phần tử HTML tương ứng với ID vị trí mới
        const element = document.getElementById(newPosition);

        if (element) {
            // Lấy nội dung quân cờ (nếu có) tại ô mới
            const newPiece = element.innerText;

            // Nếu ô trống hoặc chứa quân đối phương, thêm class `path-color` để làm nổi bật
            if (newPiece.length === 0 || isOpponentPiece(focusPiece, newPiece)) {
                element.classList.add('path-color');
                pathSs.push(element);
            }
        }
    });
};


//Phong cấp
const promotePiece = (box, color) => {
    //Nếu trò chơi đã kết thúc hoặc đang có một quân tốt khác đang được phong cấp, hàm sẽ dừng lại để tránh thực hiện phong cấp nhiều lần
    if (isGameOver || isPromoting) return;
    //Một quân tốt đang được phong cấp
    isPromoting = true;
    //Tạo một hộp thoại để chọn quân phong cấp
    const promotionDiv = document.createElement('div');
    promotionDiv.classList.add('promotion-options');
    promotionDiv.innerHTML = `
        <button class="promotion-btn">${color}hau<img class="all-img" src="./imgs/${color}hau.png" alt="${color}hau"></button>
        <button class="promotion-btn">${color}xe<img class="all-img" src="./imgs/${color}xe.png" alt="${color}xe"></button>
        <button class="promotion-btn">${color}ma<img class="all-img" src="./imgs/${color}ma.png" alt="${color}ma"></button>
        <button class="promotion-btn">${color}tinh<img class="all-img" src="./imgs/${color}tinh.png" alt="${color}tinh"></button>
    `;

    box.appendChild(promotionDiv);
    //Xử lý khi người chơi chọn quân phong cấp
    const buttons = promotionDiv.querySelectorAll('.promotion-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(`Đã chọn quân: ${btn.innerText}`);
            //Cập nhật ô cờ với quân đã chọn
            box.innerText = btn.innerText;
            //Chèn hình ảnh tương ứng vào ô cờ
            insertImage(box,box.innerText);
            //Xóa hộp thoại phong cấp sau khi người chơi chọn quân
            promotionDiv.remove();
            //Đặt lại isPromoting về false để cho phép các quân tốt khác phong cấp nếu cần
            isPromoting = false;
            clearState();//Xóa các trạng thái hiển thị khác của bàn cờ
        });
    });
};

// Hàm mô phỏng di chuyển quân cờ trên bàn cờ
const simulateMove = (piece, startId, opponentColor) => {
    // `piece`: loại quân cờ (chuỗi) mà người chơi đang di chuyển (ví dụ: 'tot', 'xe', 'ma', 'tinh', 'hau', 'vua').
    // `startId`: ID của ô hiện tại chứa quân cờ (chuỗi), ví dụ: 'b21', 'b43', giúp xác định vị trí quân cờ trên bàn cờ.
    // `opponentColor`: màu sắc quân của đối thủ (chuỗi), dùng để kiểm tra tính hợp lệ của nước đi (ví dụ: 'W' hoặc 'B').

    // Lấy ID của vị trí hiện tại bằng cách cắt bỏ ký tự đầu tiên (ví dụ: 'b14' => '14')
    const id = startId.slice(1); 

    // Kiểm tra loại quân cờ và gọi hàm di chuyển tương ứng
    if (piece === 'tot') {
        // Nếu quân cờ là quân tốt, gọi hàm di chuyển quân tốt
        movePawn(id, opponentColor);
    } else if (piece === 'xe') {
        // Nếu quân cờ là xe, gọi hàm di chuyển quân xe
        moveRook(id);
    } else if (piece === 'ma') {
        // Nếu quân cờ là mã, gọi hàm di chuyển quân mã
        moveKnight(id);
    } else if (piece === 'tinh') {
        // Nếu quân cờ là tượng, gọi hàm di chuyển quân tượng
        moveBishop(id);
    } else if (piece === 'hau') {
        // Nếu quân cờ là hậu, gọi hàm di chuyển quân hậu
        moveQueen(id);
    } else if (piece === 'vua') {
        // Nếu quân cờ là vua, gọi hàm di chuyển quân vua
        moveKing(id);
    }
};


// Hàm lấy danh sách các quân cờ của đối thủ
const getOpponentPieces = (opponentColor) => {
    // `opponentColor`: màu sắc của quân đối phương (chuỗi), dùng để xác định quân cờ nào là của đối thủ.
    // Lấy danh sách các quân cờ đối thủ bằng cách lọc qua tất cả các ô cờ trong `boxElements`
    return [...boxElements].filter(box => box.innerText.startsWith(opponentColor));
};

// Hàm kiểm tra xem ô có bị tấn công hay không
const isUnderAttack = (boxId, opponentColor) => {
    // `boxId`: ID của ô cần kiểm tra (chuỗi), ví dụ: 'b23'.
    // `opponentColor`: màu sắc của quân đối phương (chuỗi), giúp xác định quân cờ nào đang tấn công.

    const targetBox = document.getElementById(boxId); // Lấy ô cần kiểm tra
    if (!targetBox) return false; // Nếu không tìm thấy ô, trả về false

    let underAttack = false; // Biến kiểm tra trạng thái bị tấn công

    // Duyệt qua tất cả các quân cờ của đối thủ
    const opponentPieces = getOpponentPieces(opponentColor); // Lấy danh sách quân cờ đối thủ
    for (const pieceBox of opponentPieces) {
        const piece = pieceBox.innerText.slice(1); // Lấy loại quân (cắt bỏ ký tự màu)

        // Giả lập nước đi của quân cờ
        simulateMove(piece, pieceBox.id, opponentColor);

        // Kiểm tra nếu ô cần kiểm tra bị đánh dấu là `path-color`
        if (document.getElementById(boxId).classList.contains('path-color')) {
            underAttack = true; // Nếu ô bị tấn công, đánh dấu và thoát khỏi vòng lặp
            break;
        }

        // Dọn dẹp trạng thái sau mỗi lần kiểm tra
        clearState(); // Xóa các trạng thái đã đánh dấu trước đó để không ảnh hưởng đến lần kiểm tra tiếp theo
    }

    return underAttack; // Trả về true nếu ô bị tấn công, false nếu không
};



// Hàm tìm vị trí của quân vua
const findKingPosition = (kingColor) => {
    // `kingColor`: màu sắc của quân vua cần tìm (chuỗi), có thể là 'W' (trắng) hoặc 'B' (đen).
    let kingPosition = null; // Biến để lưu vị trí của vua, khởi tạo là null

    // Duyệt qua tất cả các ô cờ để tìm quân vua
    boxElements.forEach(box => {
        // Kiểm tra nếu nội dung của ô là quân vua
        if (box.innerText === `${kingColor}vua`) {
            kingPosition = box.id; // Lưu lại ID của ô chứa vua
        }
    });

    return kingPosition; // Trả về ID của ô chứa quân vua hoặc null nếu không tìm thấy
};

// Hàm kiểm tra xem quân vua có còn trên bàn cờ không
const isKingCaptured = (kingColor) => {
    // `kingColor`: màu sắc của quân vua cần kiểm tra (chuỗi).
    const kingPosition = findKingPosition(kingColor); // Lấy vị trí của quân vua

    // Nếu không tìm thấy vua, đặt trạng thái trò chơi là đã kết thúc và trả về true
    if (kingPosition === null) {
        isGameOver = true; // Đánh dấu trò chơi đã kết thúc
        return true;  // Nếu không tìm thấy vua, có nghĩa là đã bị ăn
    }
    return false; // Nếu vua còn trên bàn cờ, trả về false
};

// Hàm kiểm tra xem quân vua có bị chiếu không
const isUnderCheck = (kingColor) => {
    // `kingColor`: màu sắc của quân vua cần kiểm tra (chuỗi).
    const kingPosition = findKingPosition(kingColor); // Tìm vị trí của quân vua
    const opponentColor = kingColor === 'W' ? 'B' : 'W'; // Xác định màu sắc quân đối phương

    // Kiểm tra xem ô chứa vua có bị tấn công hay không
    if (isUnderAttack(kingPosition, opponentColor)){
        return true; // Nếu bị tấn công, trả về true
    }
    return false; // Nếu không bị tấn công, trả về false
};


// Hàm thực hiện nhập thành (castle)
const castle = (kingColor) => {
    // `kingColor`: màu sắc của quân vua (chuỗi) - 'W' cho trắng, 'B' cho đen.
    const startRow = kingColor === 'W' ? 1 : 8; // Xác định hàng của quân vua (1 cho trắng, 8 cho đen)
    const king = document.getElementById(`b${startRow}5`); // Lấy ô chứa quân vua

    // Kiểm tra nếu ô hiện tại không chứa quân vua, thì không thực hiện nhập thành
    if (king.innerText !== `${kingColor}vua`) return;

    // Kiểm tra nếu có thể nhập thành ngắn
    if (canCastleShort(kingColor)) {
        const kingDest = document.getElementById(`b${startRow}7`); // Lấy ô đích cho vua
        kingDest.classList.add('path-color'); // Tô màu ô đích
        kingDest.addEventListener('click', () => performCastle('short', kingColor), { once: true }); // Thiết lập sự kiện click cho nhập thành ngắn
    }

    // Kiểm tra nếu có thể nhập thành dài
    if (canCastleLong(kingColor)) {
        const kingDest = document.getElementById(`b${startRow}3`); // Lấy ô đích cho vua
        kingDest.classList.add('path-color'); // Tô màu ô đích
        kingDest.addEventListener('click', () => performCastle('long', kingColor), { once: true }); // Thiết lập sự kiện click cho nhập thành dài
    }
};

// Hàm thực hiện nhập thành
const performCastle = (type, color) => {
    // `type`: loại nhập thành (chuỗi) - 'short' cho nhập thành ngắn, 'long' cho nhập thành dài.
    // `color`: màu sắc của quân vua (chuỗi) - 'W' cho trắng, 'B' cho đen.
    const row = color === 'W' ? 1 : 8; // Xác định hàng của quân vua
    const king = document.getElementById(`b${row}5`); // Lấy ô chứa quân vua
    let rook, newKingPos, newRookPos; // Khai báo biến cho xe và các vị trí mới

    // Xác định vị trí của xe và vị trí mới cho vua và xe dựa vào loại nhập thành
    if (type === 'short') {
        rook = document.getElementById(`b${row}8`); // Xe cho nhập thành ngắn
        newKingPos = document.getElementById(`b${row}7`); // Vị trí mới của vua
        newRookPos = document.getElementById(`b${row}6`); // Vị trí mới của xe
    } else {
        rook = document.getElementById(`b${row}1`); // Xe cho nhập thành dài
        newKingPos = document.getElementById(`b${row}3`); // Vị trí mới của vua
        newRookPos = document.getElementById(`b${row}4`); // Vị trí mới của xe
    }

    // Di chuyển vua và xe vào vị trí mới
    newKingPos.innerHTML = king.innerHTML; // Đặt quân vua vào vị trí mới
    newRookPos.innerHTML = rook.innerHTML; // Đặt quân xe vào vị trí mới

    // Xóa nội dung ô cũ để tránh việc quân vẫn hiển thị ở vị trí cũ
    king.innerHTML = ''; // Xóa ô chứa vua
    rook.innerHTML = ''; // Xóa ô chứa xe

    // Cập nhật trạng thái đã di chuyển cho vua
    if (color === 'W') {
        whiteKingMoved = true; // Đánh dấu vua trắng đã di chuyển
    } else {
        blackKingMoved = true; // Đánh dấu vua đen đã di chuyển
    }
};

// Hàm kiểm tra xem có thể thực hiện nhập thành ngắn hay không
const canCastleShort = (color) => {
    // `color`: màu sắc của quân vua (chuỗi) - 'W' cho trắng, 'B' cho đen.
    const row = color === 'W' ? 1 : 8; // Xác định hàng của quân vua (1 cho trắng, 8 cho đen)
    const opponentColor = color === 'W' ? 'B' : 'W'; // Xác định màu sắc quân đối thủ

    // Kiểm tra các điều kiện cần thiết để nhập thành ngắn
    return !kingMoved(color) && // Vua chưa di chuyển
           !rookMoved(color, 'right') && // Xe bên phải chưa di chuyển
           document.getElementById(`b${row}6`).innerText === '' && // Ô b6 trống
           document.getElementById(`b${row}7`).innerText === '' && // Ô b7 trống
           !isUnderAttack(`b${row}5`, opponentColor) && // Ô b5 không bị tấn công
           !isUnderAttack(`b${row}6`, opponentColor) && // Ô b6 không bị tấn công
           !isUnderAttack(`b${row}7`, opponentColor); // Ô b7 không bị tấn công
};

// Hàm kiểm tra xem có thể thực hiện nhập thành dài hay không
const canCastleLong = (color) => {
    // `color`: màu sắc của quân vua (chuỗi) - 'W' cho trắng, 'B' cho đen.
    const row = color === 'W' ? 1 : 8; // Xác định hàng của quân vua
    const opponentColor = color === 'W' ? 'B' : 'W'; // Xác định màu sắc quân đối thủ

    // Kiểm tra các điều kiện cần thiết để nhập thành dài
    return !kingMoved(color) && // Vua chưa di chuyển
           !rookMoved(color, 'left') && // Xe bên trái chưa di chuyển
           document.getElementById(`b${row}2`).innerText === '' && // Ô b2 trống
           document.getElementById(`b${row}3`).innerText === '' && // Ô b3 trống
           document.getElementById(`b${row}4`).innerText === '' && // Ô b4 trống
           !isUnderAttack(`b${row}5`, opponentColor) && // Ô b5 không bị tấn công
           !isUnderAttack(`b${row}4`, opponentColor) && // Ô b4 không bị tấn công
           !isUnderAttack(`b${row}3`, opponentColor); // Ô b3 không bị tấn công
};

// Kiểm tra xem vua đã di chuyển chưa
const kingMoved = (color) => (color === 'W' ? whiteKingMoved : blackKingMoved);

// Kiểm tra xem xe đã di chuyển chưa
const rookMoved = (color, side) => {
    // `color`: màu sắc của quân cờ (chuỗi) - 'W' cho trắng, 'B' cho đen.
    // `side`: bên của xe (chuỗi) - 'left' cho bên trái, 'right' cho bên phải.
    if (color === 'W') {
        // Nếu quân trắng, trả về trạng thái của xe dựa trên bên
        return side === 'left' ? whiteRookLeftMoved : whiteRookRightMoved;
    } else {
        // Nếu quân đen, trả về trạng thái của xe dựa trên bên
        return side === 'left' ? blackRookLeftMoved : blackRookRightMoved;
    }
};

// Hàm cập nhật trạng thái của vua và xe sau khi di chuyển
const updatePieceState = (pieceText, oldId, newId) => {
    // `pieceText`: văn bản của quân cờ đang di chuyển (chuỗi)
    // `oldId`: ID của ô cờ trước khi di chuyển (chuỗi)
    // `newId`: ID của ô cờ sau khi di chuyển (chuỗi)

    // Kiểm tra xem quân vua trắng đã di chuyển chưa
    if (pieceText === 'Wvua') whiteKingMoved = true;
    // Kiểm tra xem quân vua đen đã di chuyển chưa
    if (pieceText === 'Bvua') blackKingMoved = true;

    // Cập nhật trạng thái của xe trắng bên phải
    if (oldId === 'b18' || newId === 'b18') whiteRookRightMoved = true;
    // Cập nhật trạng thái của xe trắng bên trái
    if (oldId === 'b11' || newId === 'b11') whiteRookLeftMoved = true;
    // Cập nhật trạng thái của xe đen bên phải
    if (oldId === 'b88' || newId === 'b88') blackRookRightMoved = true;
    // Cập nhật trạng thái của xe đen bên trái
    if (oldId === 'b81' || newId === 'b81') blackRookLeftMoved = true;
};


// Xóa trạng thái cũ (ô được chọn, đường đi)
const clearState = () => {
    // Duyệt qua tất cả các ô cờ
    boxElements.forEach(box => {
        // Xóa các lớp 'focus-piece' và 'path-color' khỏi từng ô cờ
        box.classList.remove('focus-piece', 'path-color');
    });
};

// Di chuyển quân cờ
const movePiece = () => {
    let focusId; // ID của ô đang được chọn
    let focusText; // Nội dung của ô đang được chọn (loại quân cờ)

    // Duyệt qua tất cả các ô cờ để thêm sự kiện click
    boxElements.forEach(box => {
        
        box.addEventListener('click', () => {
            const isFocus = box.classList.contains('focus-piece'); // Kiểm tra nếu ô này đang được chọn
            console.log(pathSs)
            if (isFocus) {
                focusId = box.id; // Lưu lại ID của ô đang chọn
                focusText = box.innerText; // Lưu lại nội dung của ô đang chọn

                // Duyệt qua các ô cờ là đường đi hợp lệ
                pathSs.forEach(valid => {
                    valid.addEventListener('click', () => {
                        const validMove = valid.classList.contains('path-color'); // Kiểm tra nếu ô có thể di chuyển tới
                        
                        // Kiểm tra xem có phải nước đi hợp lệ và ô đó có quân đối phương hay không
                        if (validMove && (valid.innerText.length === 0 || isOpponentPiece(focusText, valid.innerText))) {
                            // Kiểm tra xem có ăn quân không
                            if (valid.innerText.length !== 0) {
                                eatPiece(focusText[0], valid.innerText); // Thực hiện ăn quân
                                capturedSound.play(); // Phát âm thanh khi ăn quân
                            }

                            // Cập nhật ô cũ và ô mới
                            document.getElementById(focusId).innerText = ''; // Xóa quân cũ khỏi ô
                            valid.innerText = focusText; // Đặt quân mới vào ô mới
                            stopScore(); // Dừng lại điểm số nếu có

                            moveSound.play(); // Phát âm thanh khi di chuyển quân
                            insertImage(valid, focusText); // Chèn hình ảnh tương ứng với quân
                            
                            // Kiểm tra xem vua có bị chiếu không
                            if (isUnderCheck('W')) {
                                console.log('Vua trắng đang bị chiếu!');
                                showWarning('Vua trắng đang bị chiếu!'); // Hiển thị cảnh báo
                            } else if (isUnderCheck('B')) {
                                console.log('Vua đen đang bị chiếu!');
                                showWarning('Vua đen đang bị chiếu!'); // Hiển thị cảnh báo
                            } else {
                                hideWarning(); // Ẩn cảnh báo nếu không bị chiếu
                            }

                            tog++; // Tăng biến lượt đi

                            if(statusAI && currentPlayerColor() === 'B'){
                                //chế độ máy (tự chơi)
                                startAutoMove();
                                //không cho click khi ở chế độ máy
                                deleteClickBlack();
                            }
                            // Gọi hàm tự động di chuyển khi đến lượt máy
                            
                            
                            // Kiểm tra lượt đi
                            checkTurn();
                            //Giảm điểm người chơi
                            toggleTurn();

                            // Cập nhật trạng thái cho En Passant nếu quân tốt đi 2 ô
                            if (focusText.endsWith('tot') && Math.abs(parseInt(focusId[1]) - parseInt(valid.id[1])) === 2) {
                                enPassantTarget = {
                                    row: parseInt(valid.id[1]), // Hàng của quân tốt
                                    col: parseInt(valid.id[2]), // Cột của quân tốt
                                    color: focusText[0] // Màu của quân tốt
                                };
                                console.log('Cập nhật enPassantTarget:', enPassantTarget);
                            } else {
                                enPassantTarget = null; // Reset nếu không hợp lệ
                            }

                            // Kiểm tra xem vua có bị chiếu không để quyết định lượt đi
                            if (isKingCaptured('W')) {
                                updateScore();
                                showWinner('Bot'); // Hiển thị người thắng
                                endGame(); // Kết thúc trò chơi
                                return;
                            }
                            if (isKingCaptured('B')) {
                                updateScore();
                                showWinner('Admin'); // Hiển thị người thắng
                                endGame(); // Kết thúc trò chơi
                                return;
                            }
                            pathSs = []; //Xóa các đường đi hợp lệ trong biến
                            clearState(); // Xóa trạng thái cũ
                            // deletePathHistory();
                            // box.classList.add('path-history');
                            // valid.classList.add('path-history');
                        }
                    });
                });
            }
        });
    });
};

movePiece(); // Gọi hàm để thực hiện việc di chuyển quân cờ

// const deletePathHistory = () =>{
//     boxElements.forEach(path =>{
//         path.classList.remove('path-history');
//     });
// };

// Hàm loại bỏ tất cả sự kiện click từ các ô cờ
const removeAllEventListeners = () => {
    boxElements.forEach(item => {
        // Loại bỏ sự kiện click cho mỗi ô cờ
        item.removeEventListener('click', handleMoveItem);
        item.removeEventListener('click', movePiece);
    });
};

// Hàm kết thúc trò chơi
const endGame = () => {
    isGameOver = true; // Đánh dấu trò chơi đã kết thúc

    // Lưu điểm hiện tại vào biến `lastScore`
    lastScore = whiteScore > blackScore ? whiteScore : blackScore; // So sánh và lưu điểm cao nhất

    // Cập nhật điểm cao nhất 
    if (lastScore > highestScore) {
        highestScore = lastScore; // Cập nhật điểm cao nhất nếu có điểm mới cao hơn
    }

    stopScore(); // Dừng điểm số hiện tại

    saveGameScores(); // Lưu điểm vào Local Storage

    clearState(); // Xóa trạng thái cũ trên bàn cờ
    removeAllEventListeners(); // Loại bỏ sự kiện click từ tất cả các ô cờ
};


// Kiểm tra nếu bàn cờ đang được hiển thị và gán sự kiện cho nút Reset
const resetBtn = document.getElementById('reset-game');
resetBtn.addEventListener('click', () => resetGame());
// Hàm khởi động lại game
const resetGame = () => {
    addEventListeners(); // Thêm lại các sự kiện cho các ô cờ

    // Đặt lại trạng thái các biến
    isGameOver = false; // Đánh dấu trò chơi chưa kết thúc
    tog = 1; // Đặt lại lượt đi
    whiteKingMoved = false; // Đánh dấu vua trắng chưa di chuyển
    blackKingMoved = false; // Đánh dấu vua đen chưa di chuyển
    whiteRookLeftMoved = false; // Đánh dấu xe trái trắng chưa di chuyển
    whiteRookRightMoved = false; // Đánh dấu xe phải trắng chưa di chuyển
    blackRookLeftMoved = false; // Đánh dấu xe trái đen chưa di chuyển
    blackRookRightMoved = false; // Đánh dấu xe phải đen chưa di chuyển
    enPassantTarget = null; // Đặt lại trạng thái En Passant

    // Đặt lại điểm và giao diện
    whiteScore = 5000; // Đặt lại điểm cho quân trắng
    blackScore = 5000; // Đặt lại điểm cho quân đen
    stopScore(); // Dừng việc tính điểm hiện tại
    
    clearState(); // Xóa trạng thái cũ trên bàn cờ
    resetPieces(); // Đặt lại vị trí các quân cờ trên bàn

    resetScore(); // Đặt lại giao diện hiển thị điểm
    checkTurn(); // Kiểm tra lượt đi
    toggleTurn();// Giảm điểm người chơi
    settingsContainer.classList.add('hidden'); // Ẩn giao diện cài đặt
    console.log('Ván đấu đã được reset!'); // In ra thông báo trong console
};


// Hàm thiết lập lại quân cờ trên bàn
const resetPieces = () => {
    const initialLayout = [
        ['Bxe', 'Bma', 'Btinh', 'Bhau', 'Bvua', 'Btinh', 'Bma', 'Bxe'],
        ['Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot', 'Btot'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot', 'Wtot'],
        ['Wxe', 'Wma', 'Wtinh', 'Whau', 'Wvua', 'Wtinh', 'Wma', 'Wxe']
    ];

    initialLayout.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const boxId = `b${8 - rowIndex}${colIndex + 1}`; // Hàng theo thứ tự từ 8 đến 1
            const box = document.getElementById(boxId);

            if (piece) {
                const imgSrc = `./imgs/${piece}.png`; // Đường dẫn ảnh quân cờ
                box.innerHTML = `${piece}<img class='all-img' src='${imgSrc}' alt='${piece}'>`;
            } else {
                box.innerHTML = ''; // Ô trống không có quân cờ
            }
        });
    });
};

// Định nghĩa điểm cho từng loại quân cờ
const pointsPiece = {
    'xe': 50,    // Điểm cho quân xe
    'ma': 30,    // Điểm cho quân mã
    'tinh': 30,  // Điểm cho quân tướng
    'hau': 90,   // Điểm cho quân hậu
    'vua': 500,  // Điểm cho quân vua
    'tot': 10    // Điểm cho quân tốt
};

// Hàm xử lý khi một quân cờ bị ăn
const eatPiece = (playerColor, piece) => {
    const typePiece = piece.slice(1); // Lấy loại quân từ chuỗi tên quân
    const points = pointsPiece[typePiece]; // Lấy điểm tương ứng của quân đó

    if (playerColor === 'W') { // Nếu là quân trắng
        whiteScore += points; // Cộng điểm cho quân bị ăn
    } else { // Nếu là quân đen
        blackScore += points; // Cộng điểm cho quân bị ăn
    }
};

// Hàm cập nhật điểm người chơi
const updateScore = () => {
    whiteScoreElement.textContent = `Điểm: ${whiteScore}`; // Cập nhật điểm cho quân trắng
    blackScoreElement.textContent = `Điểm: ${blackScore}`; // Cập nhật điểm cho quân đen
};

// Hàm bắt đầu tính điểm cho người chơi
const startScore = (playerColor) => {
    scoreInterval = setInterval(() => {
        if (playerColor === 'W') { // Nếu là quân trắng
            whiteScore--; // Giảm điểm của người chơi trắng
        } else { // Nếu là quân đen
            blackScore--; // Giảm điểm của người chơi đen
        }
        updateScore(); // Cập nhật điểm sau mỗi lần giảm
    }, 150); // Giảm điểm sau mỗi 150ms
};

// Hàm dừng việc giảm điểm khi người dùng đã di chuyển con cờ
const stopScore = () => {
    clearInterval(scoreInterval); // Ngừng giảm điểm
    intervalId = null;// Đặt lại `intervalId` để tránh việc xóa lặp lại không cần thiết
};



// Hàm lưu điểm vào LocalStorage
const saveGameScores = () => {
    localStorage.setItem('highestScore', highestScore); // Lưu điểm cao nhất
    localStorage.setItem('lastScore', whiteScore); // Lưu điểm cuối cùng
};

// Hàm đặt lại giao diện điểm
const resetScore = () => {
    whiteScoreElement.textContent = `Điểm: ${whiteScore}`; // Cập nhật điểm cho quân trắng
    blackScoreElement.textContent = `Điểm: ${blackScore}`; // Cập nhật điểm cho quân đen
};

// Hàm tải điểm từ LocalStorage
const loadGameScores = () => {
    highestScore = parseInt(localStorage.getItem('highestScore')) || 0; // Lấy điểm cao nhất
    lastScore = parseInt(localStorage.getItem('lastScore')) || 0; // Lấy điểm cuối cùng

    // Cập nhật giao diện
    highestScoreElement.textContent = highestScore; // Cập nhật điểm cao nhất
    lastScoreElement.textContent = lastScore; // Cập nhật điểm cuối cùng
};


// Gọi hàm khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    loadGameScores(); // Tải điểm khi trang được mở
});

// Hiển thị điểm số và ẩn danh sách menu khi nhấn "Điểm Số"
scoreBtn.addEventListener('click', () => {
    moveSound.play(); // Phát âm thanh khi nhấn nút
    loadGameScores(); // Tải lại điểm từ Local Storage

    scoreContainer.classList.remove('hidden'); // Hiển thị khung điểm
    menuList.classList.add('hidden'); // Ẩn danh sách menu
});

// Lượt người chơi
const checkTurn = () => {
    const isBlackTurn = tog % 2 === 0; // Xác định lượt đi là của đen hay trắng
    console.log(isBlackTurn ? 'đen' : 'trắng');

    // Lấy avatar của hai người chơi
    const blackPlayerAvatar = document.querySelector('.player.black .avt');
    const whitePlayerAvatar = document.querySelector('.player.white .avt');

    // Thêm/lớp `.active-turn` dựa trên lượt đi
    if (isBlackTurn) {
        blackPlayerAvatar.classList.add('active-turn'); // Đánh dấu lượt của quân đen
        whitePlayerAvatar.classList.remove('active-turn'); // Xóa đánh dấu lượt của quân trắng
        //startScore('B'); // Bắt đầu giảm điểm cho quân đen
    } else {
        whitePlayerAvatar.classList.add('active-turn'); // Đánh dấu lượt của quân trắng
        blackPlayerAvatar.classList.remove('active-turn'); // Xóa đánh dấu lượt của quân đen
        //startScore('W'); // Bắt đầu giảm điểm cho quân trắng
    }
};

// Khi chuyển lượt (ví dụ sau một nước đi) giảm điểm người chơi
const toggleTurn = () => {
    stopScore(); // Dừng giảm điểm cho người chơi trước
    const currentPlayerColor = tog % 2 !== 0 ? 'W' : 'B'; // Xác định màu quân của người chơi hiện tại
    startScore(currentPlayerColor); // Bắt đầu giảm điểm cho người chơi hiện tại
};

//Cảnh báo
const showWarning = (message) => {
    warningText.textContent = message; // Cập nhật văn bản cảnh báo
    warningBox.style.display = 'flex'; // Hiển thị hộp cảnh báo
}

const hideWarning = () => {
    warningBox.style.display = 'none'; // Ẩn hộp cảnh báo
}

const winnerModal = document.querySelector('.winner-modal'); 
const playerWhite = document.querySelector('.white-player');
const playerBlack = document.querySelector('.black-player');
// Hiển thị người chiến thắng
const showWinner = (winner) => {
    const whiteScoreElement = document.querySelector('.white-player .player-score'); // Lấy phần tử điểm trắng
    const blackScoreElement = document.querySelector('.black-player .player-score'); // Lấy phần tử điểm đen

    // Hiển thị modal
    winnerModal.classList.remove('hidden');

    // Cập nhật hiển thị người chiến thắng
    if (winner === 'Admin') {
        playerWhite.style.display = 'block'; // Hiển thị người chơi trắng
        whiteScoreElement.textContent = `Điểm: ${whiteScore}`; // Cập nhật điểm người chơi trắng
        playerBlack.style.display = 'none'; // Ẩn người chơi đen
    } else if (winner === 'Bot') {
        playerBlack.style.display = 'block'; // Hiển thị người chơi đen
        blackScoreElement.textContent = `Điểm: ${blackScore}`; // Cập nhật điểm người chơi đen
        playerWhite.style.display = 'none'; // Ẩn người chơi trắng
    }
}

const winnerRefresh = document.querySelector('.winner-refresh');
winnerRefresh.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    resetGame();
});

const winnerEye = document.querySelector('.winner-eye');
winnerEye.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
});

const winnerHome = document.querySelector('.winner-home');
winnerHome.addEventListener('click', () => {
    chessWrapper.classList.add('hidden');
    menuContainer.classList.remove('hidden');
    winnerModal.classList.add('hidden');
    resetGame();
});

// Kiểm tra màu quân cờ hiện tại
const currentPlayerColor = () => (tog % 2 !== 0 ? 'W' : 'B');

// Hàm lấy tất cả các quân cờ còn lại trên bàn cờ
const getAllPiece = () =>{
    const piece = []; //Mảng lưu tất cả các quân cờ còn lại
    const currentPlayer = tog % 2 !== 0 ? 'W' : 'B'; // Xác định màu quân cờ của người chơi hiện tại
    boxElements.forEach(box => {
        // Kiểm tra nếu ô chứa quân cờ thuộc về người chơi hiện tại 
        if(box.innerText.startsWith(currentPlayer)){
            piece.push(box);
        }
    });
    return piece; // trả về kết quả mảng lưu các quân cờ của lượt người chơi hiện tại
};

//Hàm lấy ngẫu nhiên một phần tử trong mảng
const randomPiece = (array) => {
    //Math.floor(): làm tròn xuống
    //Math.random(): lấy ngẫu nhiên một số từ 0 đến nhỏ hơn 1
    //Tạo ra một số ngẫu nhiên từ 0 đến array.length - 1
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

//Hàm di chuyển ngẫu nhiên một quân cờ
const moveRandomPiece = () =>{
    const pieces = getAllPiece(); //lấy tất cả các quân cờ
    const selectedPiece = randomPiece(pieces); // Random một quân cờ
    const pieceId = selectedPiece.id.slice(1); // cắt lấy id 
    clearState();
    switch(selectedPiece.innerText){
        case "Wxe":
        case "Bxe":
            moveRook(pieceId);
            break;
        case "Wma":
        case "Bma":
            moveKnight(pieceId);
            break;
        case "Wtinh":
        case "Btinh":
            moveBishop(pieceId);
            break;
        case "Whau":
        case "Bhau":
            moveQueen(pieceId);
            break;
        case "Wvua":
        case "Bvua":
            moveKing(pieceId);
            break;
        case "Wtot":
        case "Btot":
            movePawn(pieceId, selectedPiece.innerText[0]); // Truyền thêm màu quân tốt (W hoặc B)
            break;
        default:
            return; // Không làm gì nếu quân cờ không xác định
    };
    prevent();
    // Lấy danh sách các đường đi hợp lệ (pathSs chứa các ô đã được tô màu `path-color`)
    if (pathSs.length > 0) {
        const targetPosition = randomPiece(pathSs); // Chọn ngẫu nhiên một nước đi từ pathSs
        
        // Kiểm tra xem ô được chọn có quân cờ cùng màu không
        const targetColor = targetPosition.innerText.charAt(0); // Màu của quân cờ tại ô đích
        const selectedColor = selectedPiece.innerText.charAt(0); // Màu của quân cờ đang di chuyển

        // Nếu ô đích không có quân cờ cùng màu
        if (targetColor !== selectedColor) {
            // Di chuyển quân cờ tới ô được chọn
            targetPosition.innerText = selectedPiece.innerText;
            selectedPiece.innerText = "";
            insertImage(targetPosition, targetPosition.innerText); // Thêm hình ảnh của quân cờ vào ô mới
            
            // Phát âm thanh khi di chuyển quân
            moveSound.play();

            clearState(); // Xóa màu sau khi di chuyển
            // selectedPiece.classList.add('path-history');
            // targetPosition.classList.add('path-history');
            tog++; // Chuyển lượt chơi
            checkTurn();// kiểm tra đến lượt ai và đánh dấu
            toggleTurn();//Bắt đầu giảm điểm
        }
    }
};
// Thiết lập tự động di chuyển khi đến lượt quân đen
const startAutoMove = () => {
    const autoMoveInterval = setInterval(() => {
        // Kiểm tra xem có phải lượt quân đen không, nếu không thì dừng lại
        if (currentPlayerColor() === 'B') {
            moveRandomPiece();
        } else {
            clearInterval(autoMoveInterval); // Dừng tự động khi đến lượt quân trắng
        }
    }, 1000); 
};

//Hàm lấy các quân cờ màu đen
// Hàm lấy tất cả các quân cờ màu đen trên bàn cờ
const getAllBlackPieces = () => {
    const blackPieces = []; // Mảng lưu tất cả các quân cờ màu đen

    boxElements.forEach((box) => {
        // Kiểm tra nếu ô chứa quân cờ màu đen (ký tự đầu tiên là 'B')
        if (box.innerText.startsWith('B')) {
            blackPieces.push(box);
        }
    });

    return blackPieces; // Trả về mảng các quân cờ màu đen
};

//Loại bỏ sự kiện click trên con màu đen
const deleteClickBlack = () => {
    const blackPieces = getAllBlackPieces();
    blackPieces.forEach(black =>{
        black.removeEventListener('click', handleMoveItem(black));
    });
};

// lỗi phong tốt(bị phong ô chéo)
//lỗi nhập thành(Khi trong trạng thái nhập thành thì không thể di chuyển bình thường
// khi bị chiếu thì cũng không di chuyển con vua bình thường được ) , chưa làm được ăn nước qua sông
//làm thêm kết thúc game
