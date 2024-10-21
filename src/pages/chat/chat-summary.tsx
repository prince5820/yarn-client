import data from '@emoji-mart/data';
import Picker from "@emoji-mart/react";
import { CircularProgress, Container, Grid, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentIcon from '../../assets/icon/common/attachment.svg?react';
import BackIcon from '../../assets/icon/common/back.svg?react';
import CloseIcon from '../../assets/icon/common/close.svg?react';
import DownloadIcon from '../../assets/icon/common/download.svg?react';
import EmojiSmile from '../../assets/icon/common/emoji-smile.svg?react';
import MenuVertical from '../../assets/icon/common/menu-vertical.svg?react';
import SendIcon from '../../assets/icon/common/send.svg?react';
import LoginImage from '../../assets/image/login.svg?react';
import RenderMessage from "../../common/components/render-message/render-message";
import { PATH_TO_CHAT, PATH_TO_CHAT_HISTORY, PATH_TO_CHAT_TRANSACTION, PATH_TO_ROOT_ROUTE } from "../../common/constants";
import { MESSAGE_MAX_FILE_SIZE_2MB, SNACKBAR_ERROR } from "../../common/message";
import { useAppDispatch } from "../../store";
import { loadInitialMessages, sendMessageToUser } from "../../store/chat/thunk";
import { Message } from "../../store/chat/types";
import { setMessage } from "../../store/snackbar/reducer";
import socket from '../../utils/web-socket-client';

const ChatSummary = () => {
  const { state } = useLocation();
  const user = state?.user;
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [textMsg, setTextMsg] = useState<string>('');
  const [visibleMsgId, setVisibleMsgId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!state) {
      navigate(PATH_TO_ROOT_ROUTE);
    }
  }, [state]);

  useEffect(() => {
    if (user && userId) {
      loadMessages();

      socket.emit('markMessagesAsRead', { senderId: parseInt(userId as string), receiverId: user.id });

      socket.on('receiveMessage', (newMessage: Message) => {
        setMessages((prevMessages) => {
          socket.emit('markMessagesAsRead', { senderId: newMessage.senderId, receiverId: user.id });

          return prevMessages ? [...prevMessages, newMessage] : [newMessage];
        });
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [user, userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !target?.closest('.svg-icon') // Prevent closing when clicking on the emoji icon itself
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const loadMessages = async () => {
    if (user && userId) {
      try {
        const response = await dispatch(loadInitialMessages(parseInt(userId), user.id));
        if (response) {
          setMessages(response);
        }
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
      }
    }
  }

  const handleSendMessage = async () => {
    const trimmedMessage = textMsg.trim();
    let fileData = null;

    if (file && file.size / 1024 / 1024 <= 2) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {

        const base64String = reader.result as string;

        fileData = {
          fileName: file.name,
          fileType: file.type,
          fileData: base64String.split(',')[1],
        };

        sendMessage(null, fileData);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      if (trimmedMessage.length > 0) {
        sendMessage(trimmedMessage, null);
      }
    }
  };

  const sendMessage = async (messageText: string | null, file: any) => {
    if (((messageText && messageText.length > 0) || file) && user && userId) {
      if (user && userId) {
        const newMessage = {
          messageText: messageText || null,
          senderId: parseInt(userId),
          receiverId: user.id,
          file: file || null,
        };

        try {
          const response = await dispatch(sendMessageToUser(newMessage));
          if (response) {
            socket.emit('sendMessage', response);
            setTextMsg('');
            setFile(null);
            setShowEmojiPicker(false);
          }
        } catch (err) {
          dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }));
        }
      }
    }
  };

  const showMessageTime = (messageId: number) => {
    setVisibleMsgId((prevId) => (prevId === messageId ? null : messageId));
  };

  const handleMenuOpen = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateChatHistory = () => {
    navigate(PATH_TO_CHAT_HISTORY, { state: { user: user } });
    handleMenuClose();
  }

  const handleNavigateChatTransaction = () => {
    navigate(PATH_TO_CHAT_TRANSACTION, { state: { user: user } });
  }

  const addEmoji = (emoji: any) => {
    if (textFieldRef.current) {
      const input = textFieldRef.current as HTMLInputElement;

      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;

      const currentValue = textMsg;

      const newValue = currentValue.substring(0, start) + emoji.native + currentValue.substring(end);

      setTextMsg(newValue);

      setTimeout(() => {
        input.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
        input.focus();
      }, 0);
    }
  };

  const handleEmojiPickerToggle = () => {
    if (!file) {
      setShowEmojiPicker((prevState) => !prevState);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size / 1024 / 1024 <= 2) {
      setFile(file);
    } else {
      dispatch(setMessage({ msg: MESSAGE_MAX_FILE_SIZE_2MB, className: SNACKBAR_ERROR }));
    }
  };

  const handleRemoveFile = () => {
    setFile(null); // Remove the selected file
    setTextMsg(''); // Remove file name from textMsg

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderFilePreview = (message: Message) => {
    const { fileName, filePath, fileType, fileData } = message;

    if (!filePath) return null;

    if (fileName && fileType && fileData && filePath) {
      const extension = fileName.split('.').pop();

      // Render preview based on the file type
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'svg':
        case 'svg+xml':
        case 'webp':
        case 'gif':
          // Render image preview
          return (
            <div className="file-preview image-preview">
              <img src={`data:${message.fileType};base64,${message.fileData}`} alt="image preview" style={{ width: '200px', borderRadius: '10px' }} />
              <div className="file-details">
                <p>{message.messageDateTime}</p>
                <DownloadIcon className="svg-icon" onClick={() => {
                  if (fileData) {
                    handleDownloadFile(fileType, fileData, fileName)
                  }
                }} />
              </div>
            </div>
          );

        case 'mp3':
        case 'wav':
        case 'mpeg':
          // Render audio preview
          return (
            <div className="file-preview audio-preview">
              <audio controls src={`data:${message.fileType};base64,${message.fileData}`} style={{ width: '210px' }} />
              <div className="file-details">
                <p>{message.messageDateTime}</p>
                <DownloadIcon className="svg-icon" onClick={() => {
                  if (fileData) {
                    handleDownloadFile(fileType, fileData, fileName)
                  }
                }} />
              </div>
            </div>
          );

        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
          // Render video preview
          return (
            <div className="file-preview video-preview">
              <video controls src={`data:${fileType};base64,${fileData}`} style={{ width: '210px' }} />
              <div className="file-details">
                <p>{message.messageDateTime}</p>
                <DownloadIcon className="svg-icon" onClick={() => handleDownloadFile(fileType, fileData, fileName)} />
              </div>
            </div>
          );

        case 'pdf':
          // Render PDF preview
          return (
            <div className="file-preview">
              <div
                style={{ width: '200px', height: '250px', border: '1px solid #ccc', background: '#ffffff', fontSize: '40px' }}
                className="d-flex align-item-center justify-content-center"
              >
                {extension}
              </div>
              <div className="file-details">
                <p>{message.messageDateTime}</p>
                <DownloadIcon className="svg-icon" onClick={() => {
                  if (fileData) {
                    handleDownloadFile(fileType, fileData, fileName)
                  }
                }} />
              </div>
            </div>
          );

        default:
          // Render default download button for other file types
          return (
            <div className="file-preview">
              <div
                style={{ width: '200px', height: '250px', border: '1px solid #ccc', background: '#ffffff', fontSize: '40px' }}
                className="d-flex align-item-center justify-content-center"
              >
                {extension}
              </div>
              <div className="file-details">
                <p>{message.messageDateTime}</p>
                <DownloadIcon className="svg-icon" onClick={() => {
                  if (fileData) {
                    handleDownloadFile(fileType, fileData, fileName)
                  }
                }} />
              </div>
            </div>
          );
      }
    }
  };

  const handleDownloadFile = (fileType: string, fileData: string | null, fileName: string) => {
    if (fileData) {
      const element = document.createElement('a');
      element.setAttribute('href', `data:${fileType};base64,${fileData}`);
      element.setAttribute('download', fileName);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    user ? (
      <Container className="wrapper-chat-summary padding-wrapper max-width-wrapper">
        <Grid container spacing={1} className="chat-summary-header-section">
          <Grid item xs={1}>
            <BackIcon className="svg-icon" onClick={() => navigate(PATH_TO_CHAT)} />
          </Grid>
          <Grid item xs={1}>
            {
              user.profileUrl ?
                <img src={user.profileUrl} className="chat-summary-image" alt="chat-summary-image" /> :
                <LoginImage className="chat-summary-image" />
            }
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body2">{user.firstName} {user.lastName}</Typography>
          </Grid>
          <Grid item xs={1}>
            <MenuVertical className="svg-icon" onClick={handleMenuOpen} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleNavigateChatTransaction}>Transaction</MenuItem>
              <MenuItem onClick={handleNavigateChatHistory}>History</MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <Container ref={chatContainerRef} className="chat-container mb-16">
          {
            messages && messages.map((message: Message, index: number) => (
              <Grid container spacing={1} key={index}>
                <Grid item xs={12} className={`${userId && message.senderId === parseInt(userId) ? 'message-sent' : 'message-received'}`}>
                  <span className="message" onClick={() => showMessageTime(message.id)}>
                    {
                      message.messageText ? (
                        <RenderMessage text={message.messageText} />
                      ) : renderFilePreview(message)
                    }
                  </span>
                </Grid>
                <Grid item xs={12} className={`${userId && message.senderId === parseInt(userId) ? 'justify-content-end' : 'justify-content-start'} d-flex ${visibleMsgId === message.id && message.messageText && 'mb-8'}`}>
                  {
                    visibleMsgId === message.id && message.messageText && (
                      <Typography className="message-date-time">{message.messageDateTime}</Typography>
                    )
                  }
                </Grid>
              </Grid>
            ))
          }
        </Container>
        <Container className="send-message-section">
          <div ref={emojiPickerRef} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <TextField
              inputRef={textFieldRef}
              type="text"
              fullWidth
              multiline
              maxRows={4}
              placeholder={file ? '' : "type something..."}
              name="textMsg"
              value={textMsg}
              onChange={(e) => setTextMsg(e.target.value)}
              disabled={file ? true : false}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
                setShowEmojiPicker(false);
              }}
              inputProps={{
                maxLength: 150
              }}
              InputProps={{
                startAdornment: file?.name && (
                  <div
                    style={{
                      backgroundColor: 'lightgrey',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      marginRight: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: '100%',
                      flexShrink: 1
                    }}
                  >
                    <span
                      style={{
                        marginRight: '8px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '135px',
                        display: 'inline-block',
                        flexGrow: 1,
                        minWidth: 0
                      }}
                    >
                      {file.name}
                    </span>
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <CloseIcon
                        className="svg-icon"
                        style={{ cursor: 'pointer', flexShrink: 0 }}
                        onClick={handleRemoveFile} // Remove the file onClick
                      />
                    )}
                  </div>
                ),
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={textMsg ? true : false}
            />
            <AttachmentIcon
              className="send-button mb-16"
              onClick={handleFileInputClick}
              style={{
                backgroundColor: textMsg ? 'lightgray' : '#eaf2ff',
                cursor: textMsg ? 'not-allowed' : 'pointer',
                opacity: textMsg ? 0.5 : 1
              }}
            />
            <EmojiSmile
              className="send-button mb-16"
              onClick={handleEmojiPickerToggle}
              style={{
                backgroundColor: file ? 'lightgray' : '#eaf2ff',
                cursor: file ? 'not-allowed' : 'pointer',
                opacity: file ? 0.5 : 1
              }}
            />
            {
              showEmojiPicker && !file && (
                <div style={{
                  position: 'absolute',
                  bottom: '60px',
                  zIndex: 1000,
                  right: '0'
                }}>
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
              )
            }
            <SendIcon
              className="send-button mb-16"
              onClick={handleSendMessage}
            />
          </div>
        </Container>
      </Container>
    ) : (
      <></>
    )
  );
};

export default ChatSummary;
