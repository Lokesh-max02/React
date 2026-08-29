package com.mangalaarangam.service;

import com.mangalaarangam.entity.Notification;
import com.mangalaarangam.entity.Role;
import com.mangalaarangam.entity.User;
import com.mangalaarangam.repository.NotificationRepository;
import com.mangalaarangam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void notify(User user, String message) {
        notificationRepository.save(Notification.builder().user(user).message(message).build());
    }

    @Transactional
    public void notifyAdmins(String message) {
        List<User> admins = userRepository.findByRole(Role.ROLE_ADMIN);
        admins.forEach(admin -> notify(admin, message));
    }

    @Transactional(readOnly = true)
    public List<Notification> getForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public long unreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAllRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
