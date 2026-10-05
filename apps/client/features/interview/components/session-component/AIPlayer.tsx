
type AIPlayerProps = {
    audioUrl : string,
    onEnded : () => void
}


const AIPlayer = ({
    audioUrl, onEnded
} : AIPlayerProps) => {
  return (
    <div>
        <audio src={audioUrl} autoPlay onEnded={onEnded}/>
    </div>
  )
}

export default AIPlayer