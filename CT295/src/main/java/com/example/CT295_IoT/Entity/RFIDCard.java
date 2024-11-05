package com.example.CT295_IoT.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity

public class RFIDCard {
    @Id
    private String uid;

    @Column(nullable = false)
    private String name;  // Trường mới để lưu tên người dùng

    // Constructors, Getters, and Setters
    public RFIDCard() {
    }

    public RFIDCard(String uid, String name) {
        this.uid = uid;
        this.name = name;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
