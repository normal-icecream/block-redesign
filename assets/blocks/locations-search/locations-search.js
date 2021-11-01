import { 
  createEl, toClassName
} from '../../scripts/scripts.js';

async function fetchLocations(url) {
  const { pathname } = new URL(url);
  const resp = await fetch(pathname);
  if (resp.ok) {
    let json = await resp.json();
    if (json.data) {
      json = json.data; // helix quirk, difference between live and local
    }
    return json;
  } else {
    console.error('No locations were found');
    return false;
  }
}

function searchByZip(zip, data) {
  let matches = data.filter((d) => {
    return zip === d.zip;
  });
  if (!matches.length) {
    /// fuzzier zip search
    matches = data.filter((d) => {
      return d.zip >= zip - 10 && d.zip <= zip + 10;
    });
  }
  return { locations: matches, type: 'zip'};
}

function searchByCity(city, data) {
  const slcVariants = ['slc', 'salt lake'];
  if (slcVariants.includes(city)) {
    city = 'salt lake city';
  }
  const matches = data.filter((d) => {
    return city === d.city.toLowerCase() || city === d.state.toLowerCase();
  });
  return { locations: matches, type: 'city' };
}

function buildResult(location) {
  const container = createEl('div');

  const title = createEl('h4');
  const titleA = createEl('a', {
    href: location.link
  });
  titleA.textContent = location.name;
  title.append(titleA);

  let subtitle;
  if (location.location) {
    subtitle = createEl('h5');
    subtitle.textContent = location.location;
  }

  const addr = createEl('p');
  addr.textContent = `${location.address}, ${location.city}, ${location.state}`.toLowerCase();

  const phone = createEl('p');
  const phoneA = createEl('a', {
    href: `tel:+${location.phone.replace(/-/g, '')}`
  });
  phoneA.textContent = location.phone;
  phone.append(phoneA);

  if (location.location) {
    container.append(title, subtitle, addr, phone);
  } else {
    container.append(title, addr, phone);
  }
  return container;
}

function displayResults(locations, type, searchTerm, allLocations) {
  const container = document.getElementById('locations-search-results');
  container.innerHTML = '';
  const heading = createEl('h3');
  const grid = createEl('div', {
    class: 'locations-search-results-grid'
  });
  if (type === 'show-all') {
    heading.textContent = 'all locations';
    locations.forEach((location) => {
      const result = buildResult(location);
      grid.append(result);
    });
  } else if (locations.length) {
    heading.textContent = `results by ${type}`;
    locations.forEach((location) => {
      const result = buildResult(location);
      grid.append(result);
    });
  } else {
    heading.textContent = `no results for ${searchTerm}... 
      but check out our other locations`;
    allLocations.forEach((location) => {
      const result = buildResult(location);
      grid.append(result);
    });
  }
  container.append(heading);
  container.append(grid);
}

function search(e, data) {
  e.preventDefault();
  const input = document.getElementById('locations-search-input');
  const value = input.value.trim();
  if (value) {
    let results = {};
    if (value == parseInt(value)) {
      results = searchByZip(parseInt(value), data);
    } else {
      results = searchByCity(value.toLowerCase(), data);
    }
    displayResults(results.locations, results.type, value, data);
  } else {
    displayResults(data, 'show-all');
  }
}

export default async function decorateLocationsSearch(block) {
  const { href } = block.querySelector('a');
  const locations = await fetchLocations(href);
  if (locations) {
    // build search bar
    const form = createEl('form', {
      class: 'locations-search-form'
    });

    const bar = createEl('input', {
      type: 'search',
      class: 'locations-search-input',
      id: 'locations-search-input',
      placeholder: 'enter city or zip here'
    });

    const searchBtn = createEl('button', {
      class: 'locations-search-btn',
      id: 'locations-search-btn'
    });
    searchBtn.textContent = 'search';
    searchBtn.addEventListener('click', (e) => {
      search(e, locations);
    });

    const showAllBtn = createEl('button', {
      class: 'locations-search-btn locations-showAll-btn',
      id: 'locations-showAll-btn'
    });
    showAllBtn.textContent = 'show all locations';
    showAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      displayResults(locations, 'show-all');
    })

    form.append(bar, searchBtn, showAllBtn);

    const results = createEl('div', {
      class: 'locations-search-results',
      id: 'locations-search-results'
    })

    block.innerHTML = '';
    block.append(form, results);
  } else {
    block.parentElement.remove();
  }
}
