package be.pxl.services.services;

import be.pxl.services.domain.Log;
import be.pxl.services.domain.dto.LogRequest;
import be.pxl.services.domain.dto.LogResponse;
import be.pxl.services.repository.LogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.listener.QueuesNotAvailableException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService implements ILogService{
    private final LogRepository logRepository;
    private final ObjectMapper objectMapper;
    private static final Logger logger = LoggerFactory.getLogger(LogService.class);

    @Override
    public void createLog(LogRequest logRequest) {
        Log log = mapToLog(logRequest);
        logRepository.save(log);
        logger.info("Log created successfully!");
    }

    private Log mapToLog(LogRequest logRequest) {
        return Log.builder()
                .timestamp(logRequest.getTimestamp())
                .action(logRequest.getAction())
                .username(logRequest.getUsername())
                .build();
    }

    @Override
    public List<LogResponse> getLogs() {
        List<Log> logs = logRepository.findAll();
        return logs.stream().map(this::mapToLogResponse).toList();
    }

    private LogResponse mapToLogResponse(Log log) {
        return LogResponse.builder()
                .timestamp(log.getTimestamp())
                .action(log.getAction())
                .username(log.getUsername())
                .build();
    }

    @RabbitListener(queues = "log-changes-post-queue")
    @Retryable(value = {QueuesNotAvailableException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void handleLogRequest(String in) {
        try {
            LogRequest logRequest = objectMapper.readValue(in, LogRequest.class);
            Log log = mapToLog(logRequest);
            logRepository.save(log);
            logger.info("Log created successfuly!");
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
