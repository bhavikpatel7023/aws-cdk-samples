import * as path from 'path';

import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import {
  CachePolicy,
  Distribution,
  OriginAccessIdentity,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class S3WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'S3WebsiteStackBucket', {
      accessControl: BucketAccessControl.PRIVATE,
      bucketName: 'bhavik-patel-7023',
    });

    new BucketDeployment(this, 'S3WebsiteStackBucketDeployment', {
      destinationBucket: bucket,
      sources: [
        Source.asset(
          path.resolve(__dirname, '..', '..', './dist', 's3-website', 'browser')
        ),
      ],
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      'S3WebsiteStackOriginAccessIdentity'
    );
    bucket.grantRead(originAccessIdentity);

    const dist = new Distribution(this, 'S3WebsiteStackDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
        cachePolicy: CachePolicy.CACHING_DISABLED,
      },
    });

    new CfnOutput(this, 'Domain Name', { value: dist.domainName });
  }
}
