import {
  faBroadcastTower,
  faChartSimple,
  faCircleCheck,
  faDollarSign,
  faHome,
  faHourglassHalf,
  faLeaf,
  faMoneyBill1,
  faPhotoFilm,
  faQuestion,
  faSackDollar,
  faShop,
  faUpload,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

const getIcon = (icon) => {
  switch (icon) {
    case 'wallet':
      return faWallet;
    case 'money-bill-1':
      return faMoneyBill1;
    case 'sack-dollar':
      return faSackDollar;
    case 'hourglass-half':
      return faHourglassHalf;
    case 'chart-simple':
      return faChartSimple;
    case 'leaf':
      return faLeaf;
    default:
      return faQuestion;
  }
};

const renderDashIcon = (dashRoute) => {
  switch (dashRoute) {
    case 'main':
      return faHome;

    case 'financial':
      return faDollarSign;

    case 'environmental':
      return faLeaf;

    case 'verification':
      return faCircleCheck;

    case 'upload':
      return faUpload;

    case 'uploads':
      return faPhotoFilm;

    case 'stream':
      return faBroadcastTower;

    case 'marketplace':
      return faShop;

    default:
      return faQuestion;
  }
};

export { getIcon, renderDashIcon };
