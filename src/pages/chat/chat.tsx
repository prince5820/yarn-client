import { Badge, Container, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from '../../assets/image/login.svg?react';
import { PATH_TO_CHAT_SUMMARY } from "../../common/constants";
import { SNACKBAR_ERROR } from "../../common/message";
import { useAppDispatch } from "../../store";
import { User } from "../../store/auth/types";
import { getUnreadMessages, getUsersList } from "../../store/chat/thunk";
import { setMessage } from "../../store/snackbar/reducer";
import socket from "../../utils/web-socket-client";

const Chat = () => {
  const [userList, setUserList] = useState<User[] | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ senderId: number, unreadCount: number }[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {

    getUsers();
    getUnreadMessagesCount();

    if (userId) {
      socket.emit('userConnected', userId);
    }

    socket.on('onlineUsers', (onlineUsers: string[]) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on('userOffline', (socketId: string) => {
      setOnlineUsers((prev) => prev.filter(id => id !== socketId));
    });

    socket.on('increaseUnreadCount', ({ senderId }) => {
      setUnreadMessages((prev) => {
        const senderUnread = prev.find((message) => message.senderId === senderId);

        if (senderUnread) {
          return prev.map((message) =>
            message.senderId === senderId
              ? { ...message, unreadCount: message.unreadCount + 1 }
              : message
          );
        } else {
          return [...prev, { senderId, unreadCount: 1 }];
        }
      });
    });

    return () => {
      socket.off('onlineUsers');
      socket.off('userOffline');
      socket.off('increaseUnreadCount');
    };
  }, [userId]);

  const getUsers = async () => {
    try {
      const response = await dispatch(getUsersList());
      if (response) {
        const filteredUsers = response.filter((user: User) => user.id?.toString() !== userId);
        setUserList(filteredUsers);
      }
    } catch (err) {
      dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
    }
  };

  const getUnreadMessagesCount = async () => {
    if (userId) {
      try {
        const response = await dispatch(getUnreadMessages(parseInt(userId)));
        if (response) {
          setUnreadMessages(response);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  }

  const getUnreadCount = (senderId: number) => {
    const userUnread = unreadMessages.find((unread) => unread.senderId === senderId);
    return userUnread ? userUnread.unreadCount : 0;
  };

  // Navigate to the chat summary of a specific user
  const goToChatSummary = (user: User) => {
    socket.emit('markMessagesAsRead', { senderId: user.id, receiverId: parseInt(userId as string) });
    navigate(PATH_TO_CHAT_SUMMARY, { state: { user: user } });
  };

  // Check if a specific user is online
  const isOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return (
    <Container className="padding-wrapper-for-non-auth max-width-wrapper">
      <Typography variant="h6" className="text-center mb-16">Chats</Typography>
      <Divider />
      {
        userList && userList.map((user) => (
          <Grid container spacing={1} className="mb-4 mt-4 d-flex align-item-center" sx={{ cursor: 'pointer' }} key={user.id} onClick={() => goToChatSummary(user)}>
            <Grid item xs={2} sx={{ position: 'relative' }}>
              {
                user.profileUrl ?
                  <img src={user.profileUrl} className="circular-image" alt="chat-image" /> :
                  <LoginImage className="circular-image" />
              }
              {user.id && isOnline(user.id.toString()) && (
                <span className="online-dot"></span>
              )}
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
              <Typography variant="caption">{user.email}</Typography>
            </Grid>
            <Grid item xs={1}>
              {user.id && getUnreadCount(user.id) > 0 && (
                <Typography variant="caption" className="unread-count">
                  <Badge badgeContent={getUnreadCount(user.id)} color="error" />
                </Typography>
              )}
            </Grid>
          </Grid>
        ))
      }
    </Container>
  )
}

export default Chat;