package com.example.Final_Project.Dto;

public class CheckEmailResponse {
    private boolean exists;

    public CheckEmailResponse(boolean exists) {
        this.exists = exists;
    }

    public boolean isExists() {
        return exists;
    }

    public void setExists(boolean exists) {
        this.exists = exists;
    }
}


