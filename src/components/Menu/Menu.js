import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import SandBox from '../Pages/SandBox/SandBox';
import DivHistogram from '../Pages/DivHistogram/DivHistogram';
import LinearClassic from '../Pages/LinearClassic/LinearClassic';
import LinearReact from '../Pages/LinearReact/LinearReact';
import DotsMap from '../Pages/DotsMap/DotsMap';
import ForceLayout from '../Pages/ForceLayout/ForceLayout';
import Life from '../Pages/Life/Life';
import Tables from '../Pages/Tables/Tables';
import GeoMap from '../Pages/GeoMap/GeoMap';
import DraggableChart from '../Pages/DraggableChart/DraggableChart';
import Brush from '../Pages/Brush/Brush';
import Zoom from '../Pages/Zoom/Zoom';

export const urls = [
    ['/Sandbox', '__sandBox__', SandBox],
    ['/DivHistogram', '(1) DivHistogram', DivHistogram],
    ['/LinearClassic', '(2/1) LinearClassic (pure d3)', LinearClassic],
    ['/LinearReact', '(2/2) LinearReact (d3 as helper)', LinearReact],
    ['/DotsMap', '(3) DotsMap', DotsMap],
    ['/ForceLayout', '(4) ForceLayout', ForceLayout],
    ['/Life', '(5) Life', Life],
    ['/Tables', '(6) Tables', Tables],
    ['/GeoMap', '(7) GeoMap', GeoMap],
    ['/DraggableChart', '(8) DraggableChart', DraggableChart],
    ['/Brush', '(9) Brush', Brush],
    ['/Zoom', '(10) Zoom', Zoom],
];

export default class Menu extends React.Component {
    render() {
        return (
            <div className={styles.menu}>
                <div className={styles.logo}>D3-Sandbox</div>
                <ul>
                    {urls.map(([url, name]) => (
                        <li key={url}>
                            <NavLink to={url} activeClassName={styles.active}>
                                {name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
