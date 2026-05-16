import type { Icon } from '@phosphor-icons/react'
import {
  ShoppingBagIcon,
  BriefcaseIcon,
  BuildingsIcon,
  AirplaneTiltIcon,
  ForkKnifeIcon,
  HospitalIcon,
  GraduationCapIcon,
  BankIcon,
  TrainIcon,
  PhoneIcon,
  HouseIcon,
  UsersIcon,
  BookOpenTextIcon,
  ChatCircleIcon,
  MapPinIcon,
  HeartIcon,
  MusicNoteIcon,
  FilmSlateIcon,
  GameControllerIcon,
  PawPrintIcon,
  FlowerIcon,
  CoffeeIcon,
  CarIcon,
  BicycleIcon,
  SunIcon,
  HandshakeIcon,
} from '@phosphor-icons/react'

export interface IconOption {
  name: string
  icon: Icon
}

export const SCENARIO_ICON_OPTIONS: IconOption[] = [
  { name: 'ShoppingBag', icon: ShoppingBagIcon },
  { name: 'Briefcase', icon: BriefcaseIcon },
  { name: 'Buildings', icon: BuildingsIcon },
  { name: 'AirplaneTilt', icon: AirplaneTiltIcon },
  { name: 'ForkKnife', icon: ForkKnifeIcon },
  { name: 'Hospital', icon: HospitalIcon },
  { name: 'GraduationCap', icon: GraduationCapIcon },
  { name: 'Bank', icon: BankIcon },
  { name: 'Train', icon: TrainIcon },
  { name: 'Phone', icon: PhoneIcon },
  { name: 'House', icon: HouseIcon },
  { name: 'Users', icon: UsersIcon },
  { name: 'BookOpenText', icon: BookOpenTextIcon },
  { name: 'ChatCircle', icon: ChatCircleIcon },
  { name: 'MapPin', icon: MapPinIcon },
  { name: 'Heart', icon: HeartIcon },
  { name: 'MusicNote', icon: MusicNoteIcon },
  { name: 'FilmSlate', icon: FilmSlateIcon },
  { name: 'GameController', icon: GameControllerIcon },
  { name: 'PawPrint', icon: PawPrintIcon },
  { name: 'Flower', icon: FlowerIcon },
  { name: 'Coffee', icon: CoffeeIcon },
  { name: 'Car', icon: CarIcon },
  { name: 'Bicycle', icon: BicycleIcon },
  { name: 'Sun', icon: SunIcon },
  { name: 'Handshake', icon: HandshakeIcon },
]

const iconMap = new Map<string, Icon>(SCENARIO_ICON_OPTIONS.map((opt) => [opt.name, opt.icon]))

export function getScenarioIcon(name: string): Icon | undefined {
  return iconMap.get(name)
}
