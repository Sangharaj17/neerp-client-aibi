package com.aibi.neerp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class NeerpApplication {

	public static void main(String[] args) {
		SpringApplication.run(NeerpApplication.class, args);
	}

	@RestController
	public static class HelloController {
		
		@GetMapping("/")
		public String hello() {
			return "Hello World";
		}
	}
}