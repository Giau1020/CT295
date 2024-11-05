package com.example.CT295_IoT.Service;

import com.example.CT295_IoT.Entity.RFIDCard;
import com.example.CT295_IoT.Repository.RFIDCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
    public class RFIDCardService {
    @Autowired
    private RFIDCardRepository repository;

    public RFIDCard findByUid(String uid) {
        return repository.findByUid(uid);
    }
    public List<RFIDCard> getAllCards() {
        return repository.findAll();
    }
    public void save(RFIDCard card) {
        repository.save(card);
    }

    }
