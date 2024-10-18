import { RenderMessageProps } from "./types";

const RenderMessage = ({ text }: RenderMessageProps) => {
  return (
    <div>
      {text.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  )
}

export default RenderMessage;