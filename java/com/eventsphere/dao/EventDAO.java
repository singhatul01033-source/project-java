package com.eventsphere.dao;

import com.eventsphere.db.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Data Access Object (DAO) for Event lifecycle and Atomic Ticket Transactions.
 * Fulfills OOP exception handling, atomic transactions, PreparedStatement, and JDBC connectivity.
 */
public class EventDAO {

    public boolean registerAndPurchaseTicket(String eventId, String tierId, String userId, int quantity, double unitPrice, String paymentMethod) throws SQLException, ClassNotFoundException {
        Connection conn = DBConnection.getConnection();
        
        String updateTierSql = "UPDATE ticket_tiers SET sold = sold + ? WHERE id = ? AND (quantity - sold) >= ?";
        String insertRegSql = "INSERT INTO registrations (id, event_id, user_id, ticket_tier_id, quantity, total_amount, booking_code, qr_code_seed, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')";
        String updateEventCountSql = "UPDATE events SET registered_count = registered_count + ? WHERE id = ?";

        try {
            // Enable atomic transaction
            conn.setAutoCommit(false);

            // 1. Decrement tier capacity
            try (PreparedStatement stmtTier = conn.prepareStatement(updateTierSql)) {
                stmtTier.setInt(1, quantity);
                stmtTier.setString(2, tierId);
                stmtTier.setInt(3, quantity);
                int rowsUpdated = stmtTier.executeUpdate();
                if (rowsUpdated == 0) {
                    throw new SQLException("Insufficient ticket tier capacity remaining.");
                }
            }

            // 2. Insert verified registration record
            String bookingCode = "EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String qrSeed = "QR_AUTH_" + bookingCode + "_" + userId;
            double totalAmount = unitPrice * quantity;

            try (PreparedStatement stmtReg = conn.prepareStatement(insertRegSql)) {
                stmtReg.setString(1, UUID.randomUUID().toString());
                stmtReg.setString(2, eventId);
                stmtReg.setString(3, userId);
                stmtReg.setString(4, tierId);
                stmtReg.setInt(5, quantity);
                stmtReg.setDouble(6, totalAmount);
                stmtReg.setString(7, bookingCode);
                stmtReg.setString(8, qrSeed);
                stmtReg.setString(9, paymentMethod);
                stmtReg.executeUpdate();
            }

            // 3. Increment event total count
            try (PreparedStatement stmtEvt = conn.prepareStatement(updateEventCountSql)) {
                stmtEvt.setInt(1, quantity);
                stmtEvt.setString(2, eventId);
                stmtEvt.executeUpdate();
            }

            // Commit atomic transaction
            conn.commit();
            return true;
        } catch (SQLException ex) {
            conn.rollback();
            throw ex;
        } finally {
            conn.setAutoCommit(true);
        }
    }

    public boolean updateEventApprovalStatus(String eventId, String status, String reason) throws SQLException, ClassNotFoundException {
        String sql = "UPDATE events SET status = ?, rejection_reason = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setString(2, reason);
            stmt.setString(3, eventId);
            return stmt.executeUpdate() > 0;
        }
    }
}
