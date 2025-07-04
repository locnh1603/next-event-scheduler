"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn-ui/avatar";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";

//================================================================================
//- INTERFACES
//================================================================================

interface Message {
  id: string;
  text: string;
  type: "incoming" | "outgoing";
  author: {
    name: string;
    avatarUrl?: string;
  };
  timestamp: string;
}

interface ChatBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

//================================================================================
//- SUB-COMPONENTS
//================================================================================

const ChatBoxRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-[600px] w-full flex-col rounded-xl border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);
ChatBoxRoot.displayName = "ChatBoxRoot";

const ChatBoxHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-4 border-b", className)}
      {...props}
    />
  )
);
ChatBoxHeader.displayName = "ChatBoxHeader";


const ChatBoxMessages = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}
      {...props}
    />
  )
);
ChatBoxMessages.displayName = "ChatBoxMessages";

const ChatBoxMessageItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "incoming" | "outgoing" }
>(({ className, variant = "incoming", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-end gap-2",
      variant === "outgoing" ? "justify-end" : "justify-start",
      className
    )}
    {...props}
  />
));
ChatBoxMessageItem.displayName = "ChatBoxMessageItem";

const ChatBoxAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & { name: string; src?: string }
>(({ className, name, src, ...props }, ref) => (
  <Avatar ref={ref} className={cn("h-8 w-8", className)} {...props}>
    {src && <AvatarImage src={src} alt={name} />}
    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
  </Avatar>
));
ChatBoxAvatar.displayName = "ChatBoxAvatar";


const ChatBoxMessageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "max-w-xs rounded-lg p-3 text-sm",
        "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
ChatBoxMessageContent.displayName = "ChatBoxMessageContent";


const ChatBoxFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t p-4", className)}
      {...props}
    />
  )
);
ChatBoxFooter.displayName = "ChatBoxFooter";

const ChatBoxInput = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement> & { onSendMessage?: (message: string) => void }
>(({ className, onSendMessage, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef.current?.value.trim();
    if (message && onSendMessage) {
      onSendMessage(message);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <form
      ref={ref}
      className={cn("flex w-full items-center space-x-2", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <Input ref={inputRef} placeholder="Type a message..." className="flex-1" />
      <Button type="submit">Send</Button>
    </form>
  );
});
ChatBoxInput.displayName = "ChatBoxInput";


//================================================================================
//- MAIN COMPONENT (HYBRID)
//================================================================================

const ChatBox = React.forwardRef<HTMLDivElement, ChatBoxProps>(
  ({ messages, onSendMessage, children, ...props }, ref) => {
    // --- RENDER CHILDREN IF PROVIDED (COMPOSITION APPROACH) ---
    if (children) {
      return (
        <ChatBoxRoot ref={ref} {...props}>
          {children}
        </ChatBoxRoot>
      );
    }

    // --- RENDER FROM PROPS IF PROVIDED (ENCAPSULATION APPROACH) ---
    return (
      <ChatBoxRoot ref={ref} {...props}>
        <ChatBoxHeader>
          <h3 className="font-semibold text-lg">Live Chat</h3>
        </ChatBoxHeader>
        <ChatBoxMessages>
          {messages?.map((msg) => (
            <ChatBoxMessageItem key={msg.id} variant={msg.type}>
              {msg.type === "incoming" && <ChatBoxAvatar name={msg.author.name} src={msg.author.avatarUrl} />}
              <ChatBoxMessageContent>
                <p>{msg.text}</p>
                <time className="text-xs text-muted-foreground/60 block text-right mt-1">
                  {msg.timestamp}
                </time>
              </ChatBoxMessageContent>
              {msg.type === "outgoing" && <ChatBoxAvatar name={msg.author.name} src={msg.author.avatarUrl} />}
            </ChatBoxMessageItem>
          ))}
        </ChatBoxMessages>
        <ChatBoxFooter>
          <ChatBoxInput onSendMessage={onSendMessage} />
        </ChatBoxFooter>
      </ChatBoxRoot>
    );
  }
);
ChatBox.displayName = "ChatBox";

// Attach sub-components for composition
const CompoundChatBox = Object.assign(ChatBox, {
  Root: ChatBoxRoot,
  Header: ChatBoxHeader,
  Messages: ChatBoxMessages,
  MessageItem: ChatBoxMessageItem,
  MessageContent: ChatBoxMessageContent,
  Avatar: ChatBoxAvatar,
  Footer: ChatBoxFooter,
  Input: ChatBoxInput,
});

export { CompoundChatBox as ChatBox, type Message as ChatBoxMessage };