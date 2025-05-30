const initiateGoSpiderScan = async (
  activeTarget,
  monitorGoSpiderScanStatus,
  setIsGoSpiderScanning,
  setGoSpiderScans,
  setMostRecentGoSpiderScanStatus,
  setMostRecentGoSpiderScan
) => {
  if (!activeTarget || !activeTarget.scope_target) {
    console.error('No active target or invalid target format');
    return;
  }

  const domain = activeTarget.scope_target.replace('*.', '');
  if (!domain) {
    console.error('Invalid domain');
    return;
  }

  try {
    setIsGoSpiderScanning(true);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/gospider/run`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fqdn: domain
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to initiate GoSpider scan: ${errorText}`);
    }

    const data = await response.json();

    monitorGoSpiderScanStatus(
      activeTarget,
      setGoSpiderScans,
      setMostRecentGoSpiderScan,
      setIsGoSpiderScanning,
      setMostRecentGoSpiderScanStatus
    );

    return data;
  } catch (error) {
    console.error('Error initiating GoSpider scan:', error);
    setIsGoSpiderScanning(false);
    setMostRecentGoSpiderScan(null);
    setMostRecentGoSpiderScanStatus(null);
  }
};

export default initiateGoSpiderScan; 