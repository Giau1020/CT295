package com.example.CT295_IoT.Repository;

import com.example.CT295_IoT.Entity.RFIDCard;
import com.example.CT295_IoT.Service.RFIDCardService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RFIDCardRepository extends JpaRepository<RFIDCard, String> {
    RFIDCard findByUid(String uid);

}
