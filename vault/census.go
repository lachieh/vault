// Copyright (c) HashiCorp, Inc.
// SPDX-License-Identifier: BUSL-1.1

//go:build !enterprise

package vault

import (
	"context"
	"time"
)

// CensusAgent is a stub for OSS
type CensusReporter interface{}

func (c *Core) setupCensusManager() error                        { return nil }
func (c *Core) BillingStart() time.Time                          { return time.Time{} }
func (c *Core) AutomatedLicenseReportingEnabled() bool           { return false }
func (c *Core) CensusAgent() CensusReporter                      { return nil }
func (c *Core) ReloadCensus() error                              { return nil }
func (c *Core) teardownCensusManager() error                     { return nil }
func (c *Core) StartManualCensusSnapshots()                      {}
func (c *Core) ManualLicenseReportingEnabled() bool              { return false }
func (c *Core) ManualCensusSnapshotInterval() time.Duration      { return time.Duration(0) }
func (c *Core) ManualCensusSnapshotRetentionTime() time.Duration { return time.Duration(0) }
func (c *Core) StartCensusReports(ctx context.Context)           {}
func (c *Core) ReloadCensusActivityLog() error                   { return nil }
