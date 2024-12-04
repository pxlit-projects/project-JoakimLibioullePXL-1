package be.pxl.services.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class QueueConfiguration {
    private static final Logger log = LoggerFactory.getLogger(QueueConfiguration.class);

    @Bean
    public Queue logPostChangesQueue(){
        log.info("Queue called successfully!");
        return new Queue("log-changes-post-queue", false);
    }
}
