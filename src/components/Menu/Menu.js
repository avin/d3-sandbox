import React from 'react';
import { NavLink } from 'react-router-dom';
import loadable from '@loadable/component';
import styles from './styles.module.scss';

export const urls = [
    ['/Sandbox', '__sandBox__', loadable(() => import('./../Pages/SandBox/SandBox'))],
    ['/DivHistogram', '(1) DivHistogram', loadable(() => import('./../Pages/DivHistogram/DivHistogram'))],
    [
        '/LinearClassic',
        '(2/1) LinearClassic (pure d3)',
        loadable(() => import('./../Pages/LinearClassic/LinearClassic')),
    ],
    ['/LinearReact', '(2/2) LinearReact (d3 as helper)', loadable(() => import('./../Pages/LinearReact/LinearReact'))],
    ['/DotsMap', '(3) DotsMap', loadable(() => import('./../Pages/DotsMap/DotsMap'))],
    ['/ForceLayout', '(4) ForceLayout', loadable(() => import('./../Pages/ForceLayout/ForceLayout'))],
    ['/Life', '(5) Life', loadable(() => import('./../Pages/Life/Life'))],
    ['/Tables', '(6) Tables', loadable(() => import('./../Pages/Tables/Tables'))],
    ['/GeoMap', '(7) GeoMap', loadable(() => import('./../Pages/GeoMap/GeoMap'))],
    ['/DraggableChart', '(8) DraggableChart', loadable(() => import('./../Pages/DraggableChart/DraggableChart'))],
    ['/Brush', '(9) Brush', loadable(() => import('./../Pages/Brush/Brush'))],
    ['/Zoom', '(10) Zoom', loadable(() => import('./../Pages/Zoom/Zoom'))],
    ['/Hierarchy', '(11) Hierarchy', loadable(() => import('./../Pages/Hierarchy/Hierarchy'))],
    ['/PixiD3', '(12) Pixi.js + D3', loadable(() => import('./../Pages/PixiD3/PixiD3'))],
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
