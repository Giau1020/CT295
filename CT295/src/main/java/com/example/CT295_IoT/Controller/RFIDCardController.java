package com.example.CT295_IoT.Controller;

import com.example.CT295_IoT.Entity.HistoryScan;
import com.example.CT295_IoT.Entity.RFIDCard;
import com.example.CT295_IoT.Repository.HistoryScanRepository;
import com.example.CT295_IoT.Repository.RFIDCardRepository;
import com.example.CT295_IoT.Service.RFIDCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/users")
public class RFIDCardController {

    @Autowired
    private RFIDCardRepository service;
    @Autowired
    private HistoryScanRepository historyScanRepository;

    @Autowired
    private RFIDCardRepository rfidCardRepository;
    @PostMapping("/add")
    public ResponseEntity<String> addRFIDCard(@RequestBody RFIDCard card) {
        // Check if a card with the given UID already exists
        RFIDCard existingCard = service.findByUid(card.getUid());
        if (existingCard != null) {
            return ResponseEntity.badRequest().body("Error: Card with UID " + card.getUid() + " already exists.");
        }

        // Save the new card to the database
        service.save(card);

        return ResponseEntity.ok("New RFID card added successfully. Name: " + card.getName());
    }

    String str = null;
    String str2;


    @PostMapping("/check")
    public String checkRFID(@RequestParam String uid) {
        RFIDCard card = rfidCardRepository.findByUid(uid);  // Tìm thẻ RFID trong CSDL
        if (card != null) {
            // Thẻ hợp lệ, tạo bản ghi HistoryScan mới
            //     System.out.println("sss");
//            HistoryScan historyScan = new HistoryScan(card, LocalDateTime.now()); // Thêm thời gian hiện tại
//            // Lưu bản ghi HistoryScan vào CSDL trực tiếp thông qua repository
//            historyScanRepository.save(historyScan);
            //  System.out.println("sss");
            HistoryScan historyScan = new HistoryScan();
            historyScan.setUid(uid);
            historyScan.setScanTime(LocalDateTime.now());
            historyScanRepository.save(historyScan);
//
//
//
//
//
            str = null;
            str2 = uid;

            return "Card is valid. Name: " + card.getName();
        } else {
            // Thẻ không hợp lệ
            str = uid;
            str2 = uid;
            return "Card is not valid.";
        }
    }

    @GetMapping("/get")
    public String getRFID(){
        if(str != null) return str;
        return "k";
    }

    @GetMapping("/getUID")
    public String getUID(){
        return str2;
    }

    @GetMapping("/getById/{uid}")
    public Optional<RFIDCard> getCardById(@PathVariable String uid){
        Optional<RFIDCard> rfidCard = service.findById(uid);
        return rfidCard;
    }

    @GetMapping("/cards")
    public ResponseEntity<List<RFIDCard>> getAllCards() {
        List<RFIDCard> cards = service.findAll();
        return ResponseEntity.ok(cards);  // Trả về danh sách thẻ dưới dạng JSON
    }


    @DeleteMapping("/delete/{uid}")
    public ResponseEntity<String> deleteRFIDCard(@PathVariable String uid) {
        Optional<RFIDCard> rfidCard = rfidCardRepository.findById(uid);

        if (rfidCard.isPresent()) {
            historyScanRepository.deleteByUid(uid);
            rfidCardRepository.deleteById(uid);
            return ResponseEntity.ok("RFID Card with UID " + uid + " has been deleted.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }




}