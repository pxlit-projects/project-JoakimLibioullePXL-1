package be.pxl.services.services;

import be.pxl.services.domain.dto.LogRequest;
import be.pxl.services.domain.dto.LogResponse;

import java.util.List;

public interface ILogService {
    void createLog(LogRequest logRequest);
    List<LogResponse> getLogs();
}
