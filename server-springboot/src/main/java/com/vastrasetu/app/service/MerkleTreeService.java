package com.vastrasetu.app.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class MerkleTreeService {

    public String computeMerkleRoot(List<String> leafHashes) {
        if (leafHashes == null || leafHashes.isEmpty()) {
            return sha256("EMPTY_TREE");
        }
        List<String> currentLevel = new ArrayList<>(leafHashes);
        while (currentLevel.size() > 1) {
            List<String> nextLevel = new ArrayList<>();
            for (int i = 0; i < currentLevel.size(); i += 2) {
                String left = currentLevel.get(i);
                String right = (i + 1 < currentLevel.size()) ? currentLevel.get(i + 1) : left;
                nextLevel.add(sha256(left + right));
            }
            currentLevel = nextLevel;
        }
        return currentLevel.get(0);
    }

    public List<String> generateProof(String targetLeafHash, List<String> leafHashes) {
        List<String> proof = new ArrayList<>();
        if (leafHashes == null || !leafHashes.contains(targetLeafHash)) {
            return proof;
        }

        List<String> currentLevel = new ArrayList<>(leafHashes);
        int index = currentLevel.indexOf(targetLeafHash);

        while (currentLevel.size() > 1) {
            List<String> nextLevel = new ArrayList<>();
            int siblingIndex = (index % 2 == 0) ? index + 1 : index - 1;
            if (siblingIndex < currentLevel.size()) {
                proof.add(currentLevel.get(siblingIndex));
            } else {
                proof.add(currentLevel.get(index)); // Duplicate if odd length
            }

            for (int i = 0; i < currentLevel.size(); i += 2) {
                String left = currentLevel.get(i);
                String right = (i + 1 < currentLevel.size()) ? currentLevel.get(i + 1) : left;
                nextLevel.add(sha256(left + right));
            }
            index = index / 2;
            currentLevel = nextLevel;
        }

        return proof;
    }

    public boolean verifyProof(String leafHash, List<String> proof, String expectedRoot) {
        if (leafHash == null || expectedRoot == null) return false;
        String current = leafHash;
        if (proof != null) {
            for (String sibling : proof) {
                if (current.compareTo(sibling) <= 0) {
                    current = sha256(current + sibling);
                } else {
                    current = sha256(sibling + current);
                }
            }
        }
        return current.equalsIgnoreCase(expectedRoot) || sha256(leafHash).equalsIgnoreCase(expectedRoot);
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
