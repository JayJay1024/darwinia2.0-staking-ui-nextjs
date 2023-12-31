import Image from "next/image";
import { ReactElement } from "react";
import { createRoot } from "react-dom/client";

interface Config {
  title?: ReactElement | string;
  description?: ReactElement | string;
  duration?: number; // millisecond
  disabledCloseBtn?: boolean;
  className?: string;
  onClose?: () => void;
}

type Status = "success" | "info" | "warn" | "error";

const createContainer = () => {
  const container = document.createElement("div");
  container.className = "fixed top-middle right-middle lg:top-5 lg:right-5 flex flex-col overflow-hidden z-40";
  document.body.appendChild(container);
  return container;
};

const createOne = (config: Config, status: Status, onClose: () => void) => {
  const domNode = document.createElement("div");

  domNode.className = `border border-primary p-middle lg:p-5 flex items-center gap-middle mb-middle animate-notification-enter relative bg-component w-[82vw] lg:w-96 ${config.className}`;

  const root = createRoot(domNode);

  root.render(
    <>
      <Image
        alt={status}
        width={20}
        height={20}
        src={`/images/status/${status}.svg`}
        className="shrink-0 self-start lg:hidden"
      />
      <Image
        alt={status}
        width={24}
        height={24}
        src={`/images/status/${status}.svg`}
        className="hidden shrink-0 self-start lg:inline"
      />
      <div className="flex flex-col gap-small">
        {config.title && <div className="break-all text-xs font-bold text-white lg:text-sm">{config.title}</div>}
        {config.description && (
          <div className="break-all text-xs font-light text-white lg:text-sm">{config.description}</div>
        )}
      </div>
      {!config.disabledCloseBtn && (
        <Image
          alt="Close"
          width={16}
          height={16}
          src="/images/close-white.svg"
          className="absolute right-1 top-1 transition-transform hover:scale-105 hover:cursor-pointer active:scale-95 lg:right-2 lg:top-2"
          onClick={onClose}
        />
      )}
    </>
  );

  return { domNode, root };
};

const DEFAULT_DURATION = 4500; // 4.5s
let notificationCount = 0;
let notificationContainer: HTMLElement | null = null;

const notificationInstance = (config: Config, status: Status) => {
  if (!notificationContainer) {
    notificationContainer = createContainer();
  }

  const { domNode: thisOne, root: thisRoot } = createOne(config, status, () => {
    thisOne.classList.add("animate-notification-leave");
  });
  const wrapper = document.createElement("div");
  wrapper.appendChild(thisOne);

  notificationContainer.appendChild(wrapper);
  notificationCount += 1;

  let isTimeout = false;
  let isHovering = false;

  thisOne.addEventListener("mouseenter", () => {
    isHovering = true;
  });
  thisOne.addEventListener("mouseleave", () => {
    isHovering = false;
    if (isTimeout) {
      setTimeout(() => {
        thisOne.classList.add("animate-notification-leave");
      }, 400);
    }
  });

  thisOne.addEventListener("animationend", (e) => {
    e.stopPropagation();
    if (thisOne.classList.contains("animate-notification-enter")) {
      thisOne.classList.remove("animate-notification-enter");
    } else {
      wrapper.style.height = `${thisOne.offsetHeight}px`;
      thisRoot.unmount();
      thisOne.remove();
      config.onClose && config.onClose();
      wrapper.classList.add("animate-notification-fadeout");
    }
  });

  wrapper.addEventListener("animationend", () => {
    wrapper.remove();
    notificationCount -= 1;

    if (notificationCount === 0) {
      notificationContainer?.remove();
      notificationContainer = null;
    }
  });

  const closer = () => {
    thisOne.classList.add("animate-notification-leave");
  };

  if (config.duration !== 0) {
    setTimeout(
      () => {
        isTimeout = true;
        if (!isHovering) {
          thisOne.classList.add("animate-notification-leave");
        }
      },
      config.duration && config.duration > 1000 ? config.duration : DEFAULT_DURATION
    );
  }

  return closer;
};

export const notification = {
  error: (config: Config) => notificationInstance(config, "error"),
  warn: (config: Config) => notificationInstance(config, "warn"),
  info: (config: Config) => notificationInstance(config, "info"),
  success: (config: Config) => notificationInstance(config, "success"),
};
