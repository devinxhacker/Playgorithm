package com.super30.Playgorithm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PlaygorithmApplication {

	public static void main(String[] args) {
		System.out.println("Show begins here !!!");
		SpringApplication.run(PlaygorithmApplication.class, args);
	}
}