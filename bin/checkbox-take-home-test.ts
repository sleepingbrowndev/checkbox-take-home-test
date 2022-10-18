#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CheckboxTakeHomeTestStack } from '../lib/checkbox-take-home-test-stack';

const app = new cdk.App();
new CheckboxTakeHomeTestStack(app, 'CheckboxTakeHomeTestStack');