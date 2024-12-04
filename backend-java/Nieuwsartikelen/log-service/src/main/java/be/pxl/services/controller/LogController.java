package be.pxl.services.controller;

import be.pxl.services.domain.dto.LogRequest;
import be.pxl.services.services.ILogService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/log")
@RequiredArgsConstructor
public class LogController {
    private final ILogService logService;
    private static final Logger log = LoggerFactory.getLogger(LogController.class);


    @PostMapping
    public void createLog(@RequestBody LogRequest logrequest) {
        log.info("Received POST request on /api/log");
        logService.createLog(logrequest);
    }

    @GetMapping
    public ResponseEntity getLogs() {
        log.info("Received GET request on /api/log");
        return new ResponseEntity(logService.getLogs(), HttpStatus.OK);
    }
}