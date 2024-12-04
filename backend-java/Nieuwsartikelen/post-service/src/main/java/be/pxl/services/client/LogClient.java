package be.pxl.services.client;

import be.pxl.services.domain.dto.LogRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="log-service", url = "http://localhost:8090")
public interface LogClient {
    @PostMapping("/api/log")
    void createLog(@RequestBody LogRequest logRequest);
}
