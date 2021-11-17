import styled from 'styled-components';
import { HTMLProps, useContext, useEffect, useRef, useState } from 'react';
import RecyclerView from '../RecyclerView';
import { motion } from 'framer-motion';
import { avatarInitialsFromName } from '../../../utils';
import chattyIcon from '../../../assets/img/chattyIcon.png';
import Divider from '../../base/Divider';
import Color from '../../../utils/vendor/color/color';
import { ThemeCtx } from '../../core/UIThemeProvider';

export interface IServerItem {
    name: string;
    avatarURL?: string;
    guid: string;
}
export interface IServerListProps {
    servers: IServerItem[];
    onServerClicked: (guid: string) => void;
}
export interface IServerAvatarProps extends Omit<HTMLProps<HTMLDivElement>, 'ref' | 'as'> {
    imgURL?: string;
    name: string;
    customAccentBg?: string;
}

const StyledAvatar = styled.div<{avatarURL?: string, baseBg?: string, accentBg?: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  
  background: ${props => props.avatarURL
          ? `no-repeat center/cover url("${props.avatarURL}")` 
          : Color(props.baseBg).lighten(.65).toString()};
  
  width: 48px;
  height: 48px;
  margin: 0 12px;
  
  font-weight: 600;
  font-size: 1.4em;
  user-select: none; // Selection highlight looks particularly ugly here

  border-radius: 50%;
  transform: scale(1);
  transition: border-radius .25s ease, background-color .25s ease, transform .15s ease-in-out;
  &:hover {
    border-radius: 35%;
    cursor: pointer;
    background-color: ${p => p.accentBg};
  }
  &:active {
    transform: scale(.95);
  }
`;

const StyledServerListContainer = styled.div<{baseBg?: string}>`
  background-color: ${p => Color(p.baseBg).darken(.5).toString()};

  height: 100vh;
  width: 100%;
  
  user-select: none;
  
  div::-webkit-scrollbar {
    display: none;
  }
`

/**
 * Server avatar component, handles hover and clicked states
 * and inherits all props from HTMLDivElement.
 * Discord-inspired server icon for servers in ServerList
 * in the server list
 * @param props
 * @constructor
 */
export function ServerAvatar(props: IServerAvatarProps) {
    const theme = useContext(ThemeCtx);
    const avatarRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!avatarRef.current) return;
        // avatarRef.current will not be null
        avatarRef.current!.onmouseenter = () => setIsHovered(true);
        avatarRef.current!.onmouseleave = () => setIsHovered(false);
    }, [avatarRef]);

    return <div style={{ paddingBottom: 8, position: 'relative' }}>
        <div style={{display: 'flex', alignItems: 'center', position: 'absolute', top: 0, left: -4, bottom: 8, ...props.style}}>
            <motion.div
                style={{backgroundColor: '#fff', borderRadius: 4, width: 8}}
                animate={{height: isHovered ? 20 : 8}}
            />
        </div>

        <StyledAvatar ref={avatarRef} avatarURL={props.imgURL} baseBg={theme.backgroundColors?.default} {...props}
                      accentBg={props.customAccentBg
                          ?? Color(theme.backgroundColors?.themeAccent).lighten(.4).saturate(.5).toString()}>
            {props.imgURL ? '' : avatarInitialsFromName(props.name)}
        </StyledAvatar>
    </div>;
}

/**
 * Displays a list of servers, given a list of server
 * names, avatars and GUIDs
 * @param {IServerListProps} props
 * @constructor
 */
export default function ServerList(props: IServerListProps) {
    const {backgroundColors} = useContext(ThemeCtx)

    return <StyledServerListContainer baseBg={backgroundColors?.default}>
        <RecyclerView fallbackHeight={56} childrenCount={props.servers.length + 2}>
            {index => index !== 0 && index !== props.servers.length + 1 ?
                <ServerAvatar name={props.servers[index - 1].name}
                              onClick={() => props.onServerClicked(props.servers[index - 1].guid)}
                              imgURL={props.servers[index - 1].avatarURL} />
                : (
                    index === 0
                        ? <>
                            <ServerAvatar name='Friends & DMs' style={{marginTop: '.5rem'}}
                                          onClick={() => props.onServerClicked('home')} imgURL={chattyIcon}
                            />
                            <Divider style={{marginBottom: '.5rem'}} />
                        </>
                        : <ServerAvatar name='Add Server' customAccentBg='green' />
                )
            }
        </RecyclerView>
    </StyledServerListContainer>
}