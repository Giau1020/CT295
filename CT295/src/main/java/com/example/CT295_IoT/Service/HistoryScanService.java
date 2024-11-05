package com.example.CT295_IoT.Service;

import com.example.CT295_IoT.Entity.HistoryScan;
import com.example.CT295_IoT.Repository.HistoryScanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoryScanService {

    @Autowired
    private HistoryScanRepository historyScanRepository;
    public void save(HistoryScan historyScan) {
        historyScanRepository.save(historyScan);  // Lưu đối tượng HistoryScan vào CSDL
    }
}
