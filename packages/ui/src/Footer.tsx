'use client';

import { Grid, Link, Spacer, Text } from '@geist-ui/core';
import type { FC } from 'react';

const Footer: FC = () => (
  <footer className="site-footer" aria-label="Donation and attribution footer">
    <Grid.Container gap={2} justify="center">
      <Grid xs={24} md={12}>
        <div className="donation-section">
          <Text h3>Support This Project</Text>
          <Spacer h={1} />
          <div className="crypto-addresses">
            <div className="address-item">
              <Text small b>
                ETH/BSC:
              </Text>
              <Text small type="secondary">
                0xBFD25B75E9a742cEC6ea68D06d631f6EF14Cfa82
              </Text>
            </div>
            <Spacer h={0.5} />
            <div className="address-item">
              <Text small b>
                TRX:
              </Text>
              <Text small type="secondary">
                TRat8qcN5zBQL11SMYWpQKD3EGJacMMy2m
              </Text>
            </div>
            <Spacer h={0.5} />
            <div className="address-item">
              <Text small b>
                BTC:
              </Text>
              <Text small type="secondary">
                bc1qww4ky9sj90k93amwmmsulx2hnvlt9fvktw9d05
              </Text>
            </div>
          </div>
        </div>
      </Grid>
      <Grid xs={24}>
        <Text small type="secondary">
          © 2024 |{' '}
          <Link href="https://t.me/likhonsheikh" target="_blank" rel="noreferrer">
            Developer
          </Link>
        </Text>
      </Grid>
    </Grid.Container>

    <style jsx>{`
      .site-footer {
        margin-top: 4rem;
        padding: 2rem 0;
        border-top: 1px solid var(--geist-border);
      }

      .donation-section,
      .copyright-section {
        text-align: center;
      }

      .crypto-addresses {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }

      .address-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `}</style>
  </footer>
);

export default Footer;
