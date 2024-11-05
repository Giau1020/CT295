// Hàm đóng mở các section khi click vào
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach((section) => {
      section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

let click = false;
// Hàm lấy mã UID được gửi từ server (server nhận từ ESP)
async function getDataFromESP(element, btn_stop) {
    let api = `https://iot123.azurewebsites.net/api/users/getUID`;

    let lastCardNumber = null; // Lưu thẻ cuối cùng để kiểm tra thay đổi

    // Lắng nghe sự kiện nhấn nút "stop" để dừng vòng lặp
    document.querySelector(`${btn_stop}`).addEventListener('click', function() {
        click = true;
        console.log("stop click");
        stop();
    });

    // Sử dụng vòng lặp while để liên tục lấy dữ liệu
    while (!click) {
        try {
            let response = await fetch(api);

            // Kiểm tra xem phản hồi có thành công không
            if (response.ok) {
                let cardNumber = await response.text();
                console.log(`Thẻ RFID quét được: ${cardNumber}`);

                // Kiểm tra nếu thẻ mới khác với thẻ trước đó
                if (cardNumber !== lastCardNumber) {
                    lastCardNumber = cardNumber; // Cập nhật thẻ cuối cùng
                        document.querySelector(`${element}`).value = cardNumber; // Hiển thị số thẻ mới
                        if(check == 1) {
                            await getCard(document.querySelector("#checkCardNumber").value);
                        }
                }
            } else {
                console.log("Lỗi khi gọi API:", response.status);
            }
        } catch (e) {
            console.log("Lỗi khi lấy dữ liệu:", e);
        }

        // Thêm độ trễ để tránh gọi API quá nhanh
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log("stop");
}


// Form thêm thẻ submit
document.getElementById("addCardForm").addEventListener("submit", function (event) {
    event.preventDefault();
    async function addCard() {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardHolder = document.getElementById("cardHolder").value.trim();
      if (cardNumber == "") {
        alert("Vui lòng quét thẻ mới");
        return;
      }
      const cardData = {
        uid: cardNumber,
        name: cardHolder,
      };
      try {
        // Gửi yêu cầu POST đến API với dữ liệu card
        const response = await fetch(
          "https://iot123.azurewebsites.net/api/users/add",
          {
            // Đảm bảo URL đúng
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Chỉ định loại dữ liệu là JSON
            },
            body: JSON.stringify(cardData), // Chuyển đổi đối tượng thành chuỗi JSON để gửi
          }
        );

        // Kiểm tra xem phản hồi có thành công không
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage); // Ném lỗi với thông báo từ phản hồi
        }

        // Nhận phản hồi từ server và xử lý
        const result = await response.text();
        console.log("Server Response:", result);
        alert(result); // Hiển thị thông báo phản hồi cho người dùng (nếu cần)
        document.getElementById("cardNumber").value = "";
        document.getElementById("cardHolder").value = "";
      } catch (error) {
        console.error("Error:", error.message); // Hiển thị lỗi ra console
        alert("Failed to add RFID card: " + error.message); // Thông báo lỗi cho người dùng
      }
    }

    addCard();
});


// View List of Added Cards
// document.querySelector(".menu-btn:nth-child(3)").addEventListener("click", function () {
//     const cardListElement = document.getElementById("cardList");
//     cardListElement.innerHTML = "";
//     async function getAll() {
//       let api = `http://localhost:8080/api/users/cards`;
//       let response = await fetch(api);
//       let cards = await response.json();

//       cards.forEach((card) => {
//         console.log(`UID: ${card.uid}, Name: ${card.name}`);
//         const li = document.createElement("li");
//         li.textContent = `Mã thẻ: ${card.uid}, Tên thẻ: ${card.name}`;
//         cardListElement.appendChild(li);
//       });
//     }
//     getAll();
// });
document.querySelector(".menu-btn:nth-child(3)").addEventListener("click", function () {
  const cardTableBody = document.querySelector("#cardTable tbody");
  cardTableBody.innerHTML = ""; // Xóa nội dung bảng hiện tại trước khi thêm mới

  async function getAll() {
      let api = `https://iot123.azurewebsites.net/api/users/cards`;
      let response = await fetch(api);
      let cards = await response.json();

      cards.forEach((card) => {
          console.log(`UID: ${card.uid}, Name: ${card.name}`);
          const row = document.createElement("tr");

          // Tạo ô dữ liệu cho mã thẻ
          const uidCell = document.createElement("td");
          uidCell.textContent = card.uid;
          row.appendChild(uidCell);

          // Tạo ô dữ liệu cho tên thẻ
          const nameCell = document.createElement("td");
          nameCell.textContent = card.name;
          row.appendChild(nameCell);

          // Tạo ô cho nút xóa
          const deleteCell = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";

          deleteCell.appendChild(deleteButton);
          row.appendChild(deleteCell);


          // Thêm hàng vào tbody của bảng
          cardTableBody.appendChild(row);
          deleteButton.addEventListener("click", () => {
              // Gửi yêu cầu xóa đến server hoặc xóa hàng khỏi giao diện
              deleteCard(card.uid, row);
          });
      });
  }
  getAll();
});



// Hàm xóa thẻ bằng uid
function deleteCard(uid, row) {
  // Xác nhận xóa
  if (confirm(`Are you sure you want to delete card with UID: ${uid}?`)) {
      // Gửi yêu cầu xóa đến server
      fetch(`https://iot123.azurewebsites.net/api/users/delete/${uid}`, {
          method: "DELETE",
      })
      .then(response => {
          if (response.ok) {
              // Xóa hàng khỏi giao diện sau khi xóa thành công
              row.remove();
              console.log(`Card with UID: ${uid} has been deleted.`);
          } else {
              console.error("Failed to delete card.");
          }
      })
      .catch(error => console.error("Error:", error));
  }
}



let cardsData = []; // Lưu trữ dữ liệu thẻ ban đầu

async function getAllCard() {
    let api = `https://iot123.azurewebsites.net/api/users/historyscan`;
    const tableBody = document.querySelector("#cardTableHistory tbody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    try {
        let response = await fetch(api);
        cardsData = await response.json(); // Lưu trữ dữ liệu vào biến toàn cục

        displayCards(cardsData); // Hiển thị dữ liệu ban đầu
    } catch (e) {
        console.log(e);
    }
}

function displayCards(cards) {
    const tableBody = document.querySelector("#cardTableHistory tbody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    cards.reverse().slice(0, 10).forEach((card) => {
        const row = document.createElement("tr");

        // Chuyển chuỗi thời gian thành đối tượng Date
        const scanTime = new Date(card.scanTime);

        // Định dạng thời gian để hiển thị
        const formattedTime = scanTime.toLocaleString();

        // Tạo các ô dữ liệu cho bảng
        const cardCell = document.createElement("td");
        cardCell.textContent = card.uid;

        const timeCell = document.createElement("td");
        timeCell.textContent = formattedTime;

        // Thêm các ô vào hàng
        row.appendChild(cardCell);
        row.appendChild(timeCell);

        // Thêm hàng vào tbody của bảng
        tableBody.appendChild(row);
    });
}

function searchHistory() {
    const searchUID = document.querySelector("#searchUID").value.trim();

    // Lọc các bản ghi khớp với UID
    const filteredCards = cardsData.filter(card => card.uid.includes(searchUID));

    // Hiển thị dữ liệu đã lọc
    displayCards(filteredCards);
}





  // Hàm lấy dữ liệu của 1 thẻ
  async function getCard(id) {
    let api = `https://iot123.azurewebsites.net/api/users/getById/${id}`;
    try {
      let response = await fetch(api);
      let card = await response.json();
      if (response.ok) {
        const resultDiv = document.getElementById("cardInfoResult");
        console.log(card);
        if (card != null) {
          resultDiv.innerHTML = `
          <table border="1" style="margin-top: 20px;" class = "table-style">
              <tr><th colspan="2">Thông tin của thẻ</th></tr>
              <tr><td>Tên thẻ</td><td>${card.name}</td></tr>
              <tr><td>Mã thẻ</td><td>${card.uid}</td></tr>
          </table>
      `;
         // resultDiv.innerHTML = `<p>Mã thẻ: ${card.uid}</p> <p></p><p>Name: ${card.name}</p>`;
        } else {
          alert("Thẻ không tồn tại");
          resultDiv.innerHTML = "";
          document.querySelector("#checkCardNumber").value = "";
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }


//   Sự kiện khi nhấn nút quét thẻ
document.querySelector('.start').addEventListener('click', function(event){
    event.preventDefault();
    console.log("start click");
    document.getElementById("scanStatus").innerText = "processing card scan...";
    click = false;
    getDataFromESP('#cardNumber', '.stop'); //Hiển thị số thẻ khi quét thẻ mới

});


let check =0;
// Sự kiện khi nhấn nút Scan trong div check
document.querySelector('.Scan').addEventListener('click',async function(event){
    event.preventDefault();
    console.log("start click");
    document.getElementById("scanStatusCheck").innerText = "processing card scan...";
    check = 1;
    click = false;
    await getDataFromESP('#checkCardNumber', '.stopScan'); //Hiển thị số thẻ khi quét thẻ mới
});


// Sự kiện khi nhấn các nút stopScan
function stop(){
    document.querySelector('#scanStatus').innerText = ``;
    document.querySelector('#scanStatusCheck').innerText = ``;
    click = true;


}





