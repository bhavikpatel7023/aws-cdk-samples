#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3WebsiteStack } from '../lib/s3-website-stack';

const app = new cdk.App();
new S3WebsiteStack(app, 'S3WebsiteStack');
