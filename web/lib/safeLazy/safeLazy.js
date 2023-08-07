import {safeImport} from '@niftgen/safeImport';
import {lazy} from 'react';

export const safeLazy = importer => lazy(() => safeImport(importer));
