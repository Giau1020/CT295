const cardList = [];

// Function to show specific section based on button click
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
}
document.querySelector('.start').addEventListener('click', function(event) {
    event.preventDefault();
    console.log("start click");

    async function getDataFromESP() {
        let api = `http://localhost:8080/api/users/getUID`;
        let click = false;
        let lastCardNumber = null; // Lưu thẻ cuối cùng để kiểm tra thay đổi

        // Lắng nghe sự kiện nhấn nút "stop" để dừng vòng lặp
        document.querySelector('.stop').addEventListener('click', function() {
            click = true;
            console.log("stop click");
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

                        // Kiểm tra xem thẻ đã tồn tại hay là thẻ mới
                        if (cardNumber === "k") {
                            alert("Thẻ đã tồn tại");
                            document.querySelector('#cardNumber').value = ""; // Xóa hiển thị nếu thẻ đã tồn tại
                        } else {
                            document.querySelector('#cardNumber').value = cardNumber; // Hiển thị số thẻ mới
                        }
                    }
                } else {
                    console.log("Lỗi khi gọi API:", response.status);
                }
            } catch (e) {
                console.log("Lỗi khi lấy dữ liệu:", e);
            }

            // Thêm độ trễ để tránh gọi API quá nhanh
            await new Promise(resolve => setTimeout(resolve, 1500)); // Điều chỉnh thành 2 giây
        }

        console.log("stop"); // In ra khi vòng lặp dừng
    }

    getDataFromESP();
});

// Handle Add Card form submission
document
  .getElementById("addCardForm")
  .addEventListener("submit", function (event) {
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
          "http://localhost:8080/api/users/add",
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

// Handle Check Card Information
document.querySelector(".Scan").addEventListener("click", function (event) {
  const resultDiv = document.getElementById("cardInfoResult");
  resultDiv.innerHTML = "";
  event.preventDefault();

  async function getDataFromESP() {
    let api = `http://localhost:8080/api/users/getUID`;
    let click = false;
    let lastCardNumber = null; // Lưu thẻ cuối cùng để kiểm tra thay đổi

    // Lắng nghe sự kiện nhấn nút "stop" để dừng vòng lặp
    document.querySelector('.stopScan').addEventListener('click', function() {
        click = true;
        console.log("stop click");
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

                    // Kiểm tra xem thẻ đã tồn tại hay là thẻ mới

                        document.querySelector('#checkCardNumber').value = cardNumber; // Hiển thị số thẻ mới

                        // Hiển thị thông tin thẻ
                        getCard(document.querySelector("#checkCardNumber").value);


                }
            } else {
                console.log("Lỗi khi gọi API:", response.status);
            }
        } catch (e) {
            console.log("Lỗi khi lấy dữ liệu:", e);
        }

        // Thêm độ trễ để tránh gọi API quá nhanh
        await new Promise(resolve => setTimeout(resolve, 200)); // Điều chỉnh thành 2 giây
    }

    console.log("stop"); // In ra khi vòng lặp dừng
}
  // async function getDataFromESP() {
  //   let api = `http://localhost:8080/api/users/getUID`;
  //   try {
  //     let response = await fetch(api);
  //     let text = await response.text();
  //     if (response.ok) {
  //       console.log(text);
  //       document.querySelector("#checkCardNumber").value = text;
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
   getDataFromESP();
});


// View List of Added Cards
document
  .querySelector(".menu-btn:nth-child(3)")
  .addEventListener("click", function () {
    const cardListElement = document.getElementById("cardList");
    cardListElement.innerHTML = "";
    async function getAll() {
      let api = `http://localhost:8080/api/users/cards`;
      let response = await fetch(api);
      let cards = await response.json();

      cards.forEach((card) => {
        console.log(`UID: ${card.uid}, Name: ${card.name}`);
        const li = document.createElement("li");
        li.textContent = `Mã thẻ: ${card.uid}, Tên thẻ: ${card.name}`;
        cardListElement.appendChild(li);
      });
    }
    getAll();
  });

// View list card scanning history
// async function getAllCard() {
//     let api = `http://localhost:8080/api/users/historyscan`;
//     try{
//         let response = await fetch(api);
//         let cards = await response.json();

//         cards.forEach(card => {
//             const li = document.createElement('li');
//             li.textContent = `Mã thẻ: ${card.uid}, thời gian: ${card.scan_time}`;
//             document.querySelector('#cardListHistory').appendChild(li);
//         });
//     }
//     catch(e){
//         console.log(e);
//     }
// }
async function getAllCard() {
  let api = `http://localhost:8080/api/users/historyscan`;
  document.querySelector("#cardListHistory").innerHTML = "";
  try {
    let response = await fetch(api);
    let cards = await response.json();

    cards.slice(0, 10).reverse().forEach((card) => {
      const li = document.createElement("li");

      // Chuyển chuỗi thời gian thành đối tượng Date
      const scanTime = new Date(card.scanTime);

      // Định dạng thời gian để hiển thị (tùy chọn định dạng, ví dụ 'toLocaleString')
      const formattedTime = scanTime.toLocaleString();

      // Hiển thị thông tin thẻ và thời gian quét
      li.textContent = `Mã thẻ: ${card.uid}, Thời gian quét: ${formattedTime}`;
      document.querySelector("#cardListHistory").appendChild(li);
    });
  } catch (e) {
    console.log(e);
  }
}



// Hàm lấy dữ liệu của 1 thẻ
async function getCard(id) {
  let api = `http://localhost:8080/api/users/getById/${id}`;
  try {
    let response = await fetch(api);
    let card = await response.json();
    if (response.ok) {
      console.log(card);
      if (card != null) {
        const resultDiv = document.getElementById("cardInfoResult");
        resultDiv.innerHTML = `<p>Mã thẻ: ${card.uid}</p> <p></p><p>Name: ${card.name}</p>`;
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