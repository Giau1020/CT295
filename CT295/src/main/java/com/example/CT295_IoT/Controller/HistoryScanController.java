package com.example.CT295_IoT.Controller;

import com.example.CT295_IoT.Entity.HistoryScan;
import com.example.CT295_IoT.Entity.RFIDCard;
import com.example.CT295_IoT.Repository.HistoryScanRepository;
import com.example.CT295_IoT.Repository.RFIDCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class HistoryScanController {
    @Autowired
    private HistoryScanRepository historyScanRepository;

    @GetMapping("/historyscan")
    public ResponseEntity<List<HistoryScan>> getAllCards() {
        List<HistoryScan> cards = historyScanRepository.findAll();
        return ResponseEntity.ok(cards);  // Trả về danh sách thẻ dưới dạng JSON
    }


}
