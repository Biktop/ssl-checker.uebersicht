/**
 * Check ssl expiry date for ssl certificates for Übersicht
 * 
 * Version: 1.0
 * Last Updated: 09/22/2020
 * 
 * Created by Victor Savostin
 */

export const command = './ssl-checker.widget/ssl.sh';

// Refresh every X miliseconds
export const refreshFrequency = 1000 * 60 * 60 * 24;

// Base layout
export const className = {
  top: '5px',
  left: '5px',
  color: 'rgba(255,255,255,0.6)',
  fontFamily: 'Fira Code Retina',
  fontWeight: 100,
  fontSize: '12px'
}

const threshold = 14; // Days

// Render the widget
export const render = ({output, error}) => {
  if (error) { return <div>Oops: <strong>{String(error)}</strong></div> }

  const now = new Date().getTime();
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

  const items = output.split('\n').filter(Boolean)
    .reduce((out, item) => {
      const [ domain, timestamp ] = item.split(' ');
       
      const date = new Date(timestamp);
      const days = Math.floor((date.getTime() - now) / 1000 / 60 / 60 / 24);

      return [...out, { domain, date, days, warning: days < threshold }];
    }, [])
    .sort((a, b) => a.date > b.date);
  
  return (
    <table>
      <tbody>
        {items.map(({ domain, date, days, warning }) => <tr><td>{domain}<span style={{color: warning ? 'rgba(255,0,0,0.4)' : 'rgba(255,255,255,0.4)'}}>&nbsp;->&nbsp;<strong>{days}</strong> ({date.toLocaleDateString('EN', options)})</span></td></tr>)}
      </tbody>
    </table>
  )
}