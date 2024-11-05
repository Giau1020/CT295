package com.example.CT295_IoT.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "HistoryScan", schema = "dbo")  // Đảm bảo đúng tên bảng 'HistoryScan'
public class HistoryScan {
    // Các thuộc tính của entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "uid", nullable = false)
    private String uid;

    @Column(name = "scan_time", insertable = false, updatable = false)
    private LocalDateTime scanTime;
    // Constructors
    public HistoryScan() {
    }

//    public HistoryScan(RFIDCard rfidCard, LocalDateTime scanTime) {
//        this.rfidCard = rfidCard;
//        this.scanTime = scanTime;
//    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
    //    public RFIDCard getRfidCard() {
//        return rfidCard;
//    }
//
//    public void setRfidCard(RFIDCard rfidCard) {
//        this.rfidCard = rfidCard;
//    }

    public LocalDateTime getScanTime() {
        return scanTime;
    }

    public void setScanTime(LocalDateTime scanTime) {
        this.scanTime = scanTime;
    }
}

