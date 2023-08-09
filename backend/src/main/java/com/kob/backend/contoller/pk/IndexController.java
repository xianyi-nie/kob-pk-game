package com.kob.backend.contoller.pk;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pk/")
public class IndexController {
    @RequestMapping("index/")
    public Map<String, String> index() {
        Map<String, String> map = new HashMap<>();
        map.put("name","apple");
        map.put("rating", "1000");
        return map;
    }
}
