import PlayIcon         from '../assets/icons/play.svg?react'
import PauseIcon        from '../assets/icons/pause.svg?react'
import ShuffleIcon      from '../assets/icons/shuffle.svg?react'
import RepeatIcon       from '../assets/icons/repeat.svg?react'
import HeartIcon        from '../assets/icons/heart.svg?react'
import HomeIcon         from '../assets/icons/home.svg?react'
import SearchIcon       from '../assets/icons/search.svg?react'
import LibraryIcon      from '../assets/icons/library.svg?react'
import ListIcon         from '../assets/icons/list.svg?react'
import DeviceIcon       from '../assets/icons/device.svg?react'
import NotificationIcon from '../assets/icons/notification.svg?react'
import LyricIcon        from '../assets/icons/lyric.svg?react'
import MutedSpeakerIcon from '../assets/icons/mutedSpeaker.svg?react'
import SpeakerIcon      from '../assets/icons/speaker.svg?react'

// ... các icon khác

type IconName = 'play' | 'pause' | 'shuffle' | 'repeat' | 'heart' | 'home' | 'search' | 'library' | 'list' | 'device' | 'notification' | 'lyric' | 'mutedSpeaker' | 'speaker';

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const props = { width: size, height: size }
  switch (name) {
    case 'play'        : return <PlayIcon         {...props} />
    case 'pause'       : return <PauseIcon        {...props} />
    case 'shuffle'     : return <ShuffleIcon      {...props} />
    case 'repeat'      : return <RepeatIcon       {...props} />
    case 'heart'       : return <HeartIcon        {...props} />
    case 'home'        : return <HomeIcon         {...props} />
    case 'search'      : return <SearchIcon       {...props} />
    case 'library'     : return <LibraryIcon      {...props} />
    case 'list'        : return <ListIcon         {...props} />
    case 'device'      : return <DeviceIcon       {...props} />
    case 'notification': return <NotificationIcon {...props} />
    case 'lyric'       : return <LyricIcon        {...props} />
    case 'mutedSpeaker': return <MutedSpeakerIcon {...props} />
    case 'speaker'     : return <SpeakerIcon      {...props} />

    // thêm các case khác

    default: return null
  }
}